import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { SessionDetail } from "../medical-agent/[sessionId]/page";
import moment from "moment";

type props = {
    record:SessionDetail
}

function ViewReportDialog({record}:props) {
  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant={"outline"}>View Report</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle asChild><h2 className="text-center text-xl">Medical AI Voice Agent Report</h2></DialogTitle>
            <DialogDescription asChild>
                <div className="my-4 flex flex-col gap-8">
                    <div>
                        <h2 className="font-bold text-lg text-blue-500 py-2">ข้อมูลการปรึกษา</h2>
                    
                        <div className="grid grid-cols-2 gap-2">                   
                            <h2><span className="text-primary font-bold">Docter Specialization: </span> {record.selectedDocter?.specialist}</h2>
                            <h2><span className="text-primary font-bold">Consult Date: </span>{moment(new Date(record?.createdOn)).fromNow()}</h2>
                        </div>
                    </div>

                    <div>
                        <h2 className="font-bold text-lg text-blue-500 py-2">ข้อมูลจากคนไข้</h2>
                    
                        <div className="grid grid-cols-2 gap-2">                      
                            <h2><span className="text-primary font-bold">ชื่อ: </span> {record?.report?.user}</h2>
                            <h2><span className="text-primary font-bold">อาการ: </span> {record?.report?.chiefComplaint}</h2>
                        </div>
                    </div>

                    <div>
                        <h2 className="font-bold text-lg text-blue-500 py-2">รายงานจากแพทย์</h2>
                    
                        <div className="flex flex-col gap-2">                      
                            <h2><span className="text-primary font-bold">สรุปภาพรวม: </span> {record?.report?.summary}</h2>
                            <h2><span className="text-primary font-bold">สรุปอาการ: </span> {record?.report?.symptoms}</h2>
                            <h2><span className="text-primary font-bold">คำแนะนำ: </span> {record?.report?.recommendations}</h2>
                            <h2><span className="text-primary font-bold">รายชื่อยาที่จำเป็น: </span> {record?.report?.medicationsMentioned}</h2>
                        </div>
                    </div>
                </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default ViewReportDialog;
