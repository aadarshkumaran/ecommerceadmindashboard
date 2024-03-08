import Stripe from "stripe";
import { NextResponse } from "next/server";

import { stripe } from "@/lib/stripe";
import prismadb from "@/lib/prismadb";

{/*
we are gonna reuse it. basically the POST request is not gonna work right now in front end store,
because CORS is going to prevent that because it is of different origin. (store is running in localhost 3001 and dashboard is running at localhost
3000) so thats why we are going to create headers.
*/}

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
}

//Before doing POST request, we have to do OPTIONS request, else the cors request still not gonna work.

export async function OPTIONS() {
    return NextResponse.json({}, { headers: corsHeaders })
}

//POST
export async function POST(req: Request, { params }: { params: { storeId: string } }) {
    const { productIds } = await req.json();
    if(!productIds || productIds.length === 0){
        return new NextResponse('Product IDs are required',{status : 400});
    }

    //finding all the products which is in the productIDs
    const products = await prismadb.product.findMany({
        where:{
            id : {
                in: productIds
            }
        }
    })

    const line_items : Stripe.Checkout.SessionCreateParams.LineItem[] = [];

    //pushing the products into stripe line items and calculate the price amount
    products.forEach((product)=>{
        line_items.push({
            quantity:1,
            price_data:{
                currency:'INR',
                product_data:{
                    name: product.name,
                },
                unit_amount: product.price.toNumber()*100,
            }
        })
    })

        //creating order 
        const order = await prismadb.order.create({
            data:{
                storeId: params.storeId,
                isPaid:false,
                orderItems:{
                    create: productIds.map((productId : string)=>({
                        product:{
                            connect:{
                                id : productId
                            }
                        }
                    }))
                }
            }
        });

        const session = await stripe.checkout.sessions.create({
            line_items,
            mode: "payment",
            billing_address_collection:"required",
            phone_number_collection:{
                enabled : true,
            },
            //on summary.tsx in store, the useeffect is going to notice that payment is success and it is going to trigger that the payment has been completed
            success_url:`${process.env.FRONTEND_STORE_URL}/cart?success=1`,
            cancel_url:`${process.env.FRONTEND_STORE_URL}/cart?cancelled=1`,
            metadata:{
                orderId : order.id,
            }
        })

        return NextResponse.json({url : session.url},{
            headers: corsHeaders
        });
}