import {Button} from "@/components/ui/button";
import {ArrowLeft} from "lucide-react";
import Link from "next/link";
import type {ReactNode} from "react";

interface IProps {
  href: string;
  children: ReactNode;
}

export default function PageTopBackLink({href, children}: IProps) {
  return (
    <Link href={href}>
      <div className="flex items-center gap-3 mb-3">
        <Button variant="ghost" size="sm" className="p-2">
          <ArrowLeft className="h-4 w-4 text-[#214F47]"/>
        </Button>
        <span className="text-sm text-[#214F47]">{children}</span>
      </div>
    </Link>
  )
}