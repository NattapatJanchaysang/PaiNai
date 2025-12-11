import React from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { SessionDetail } from "../medical-agent/[sessionId]/page";
import { Button } from "@/components/ui/button";
import moment from 'moment'
import ViewReportDialog from "./ViewReportDialog";

type Props = {
    historyList:SessionDetail[]
}
export default function HistoryTable({historyList}:Props) {
  return (
    <div className="border-2 border-dashed rounded mt-5 gap-2 p-6">
      <Table>
        <TableCaption>Previous Consulation Reports</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[200px]">Ai Medical Specialist</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
        {historyList.map((record:SessionDetail,index:number)=>(
          <TableRow>
            <TableCell className="font-medium">{record.selectedDocter?.specialist}</TableCell>
            <TableCell>{record.notes}</TableCell>
            <TableCell>{moment(new Date(record.createdOn)).fromNow()}</TableCell>
            <TableCell className="text-right"><ViewReportDialog record={record}/></TableCell>
          </TableRow>                
            ))}
        </TableBody>
      </Table>
    </div>
  );
}
