
import { redirect } from "next/navigation";

export function ErrorServer() {
    redirect("/error");
}
