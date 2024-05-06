import { referenceType } from "@/types";
import { Dispatch, SetStateAction } from "react";
import { FaCity } from "react-icons/fa6";








export default function Card({
    reference,
    setSelectedReference,
    selectedReference
}: {
    reference: referenceType,
    setSelectedReference: Dispatch<SetStateAction<referenceType | null>>,
    selectedReference: referenceType | null
}) {
    return(
        <div className={`flex flex-row gap-4 p-4 rounded-md bg-slate-50 hover:bg-slate-100 ${selectedReference && selectedReference.id == reference.id? 'bg-slate-200': ''} items-center transition-all cursor-pointer`} onClick={(() => setSelectedReference(reference))}>
            <div className="flex aspect-square">
                <FaCity className="text-9xl text-gray-600"/>
            </div>
            <div className="flex flex-col gap-2">
                <label>
                    <b>Adı Soyadı:</b> {reference.fullName}
                </label>
                <label>
                    <b>Çalıştığı Firma/Görevi:</b> {reference.reference}
                </label>
                <label>
                    <b>Telefon:</b> {reference.phone}
                </label>
                <label>
                    <b>E-posta:</b> {reference.email}
                </label>
            </div>
        </div>
    )
}