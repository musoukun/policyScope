import { getAllParties } from "@/app/actions/parties";
import { PolicyWikiClient } from "./components/PolicyWikiClient";

export default async function PolicyWikiPage() {
  const parties = await getAllParties();

  return <PolicyWikiClient parties={parties} />;
}