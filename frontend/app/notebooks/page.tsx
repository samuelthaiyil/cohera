import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function Notebooks() {
  return (
    <div className="p-8 w-full">
      <div className="flex flex-row justify-between">
          <h1 className="tracking-tighter text-2xl mb-6">Notebooks</h1>
          <button className="bg-blue-500 px-4 py-1 text-white rounded-md hover:cursor-pointer">Create</button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Name</TableHead>
            <TableHead className="w-[100px]">By</TableHead>
            <TableHead className="w-[100px]">Date</TableHead>
            <TableHead className="w-[100px]">Last Modified</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody></TableBody>
      </Table>
    </div>
  );
}

