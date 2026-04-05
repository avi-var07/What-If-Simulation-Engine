import express ,{Request, Response} from "express";
import fs from "fs";
import cors from "cors";
const app=express();
app.use(cors());
const data: string = fs.readFileSync("deals.csv", "utf-8");
const rows: string[]= data.split("\n").slice(1);

let wonDeals: number =0;
let lostDeals:number =0;
let dealValueTotal:number =0;
let q3Deals:number =0;

rows.forEach((row:string)=>{
    const cols:string[]= row.split(",");

    const stage:string=cols[3];
    const dealValue:number =Number(cols[4]);
    const closedDate:string =cols[2];

    if(stage==="Closed Won"){
        wonDeals++;
        dealValueTotal+=dealValue;
    }
    if(stage==="Closed Lost")lostDeals++;

    if(closedDate==="")q3Deals++;
});

const conversionRate:number = wonDeals/(wonDeals+lostDeals);
const avgDealSize:number = dealValueTotal/wonDeals;

const estimatedRev:number = q3Deals*conversionRate*avgDealSize;

app.get("/simulation", (req: Request,res: Response)=>{
    // res.json({
    //     conversionRate, avgDealSize, q3Deals, estimatedRev,
    // });
    
    const conversionChange:number = Number(req.query.conversion)||0;
    const dealSizeChange:number =Number(req.query.dealSize)||0;
    
    const newConversion:number = conversionRate*(1+conversionChange/100);
    const newDealSize:number= avgDealSize*(1+dealSizeChange/100);
    
    const newRevenue:number = q3Deals*newConversion*newDealSize;

    res.json({
        baseline: estimatedRev,
        scenario: newRevenue,
        impact: newRevenue-estimatedRev,
    });
});

app.listen(5000, ()=>console.log("Server Running!"));