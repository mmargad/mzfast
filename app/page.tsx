import axios from "axios";
import { shuffle } from "radash";

import { Loading, RocketLoading } from "@/components/Lotties";
import AuthRedirect from "@/components/auth-redirect";

export default async function Page() {
  const dnsServers = shuffle([
    "https://dns.alidns.com/resolve",
    "https://doh.pub/dns-query",
    "https://9.9.9.9:5053/dns-query",
  ]);

  async function getDomainsFromTXT(domain: string) {
    for (const server of dnsServers) {
      try {
        const { data } = await axios.get(`${server}?name=${domain}&type=16`);
        const txtRecords = data.Answer[0].data;

        return txtRecords.replace(/"/g, "").split(";");
      } catch (error) {
        console.error(`DNS query failed ${server}）：`, error);
      }
    }

    return [];
  }

  const domains = await getDomainsFromTXT(
    (process.env.DNS || process.env.NEXT_PUBLIC_DNS)!,
  );

  return (
    <section className="flex flex-col items-center justify-around w-full min-h-[calc(100dvh-65px-env(safe-area-inset-top))]">
      <div className="w-full md:w-3/5 overflow-hidden">
        <RocketLoading className="scale-150" />
      </div>
      <div className="w-full md:3/5 overflow-hidden">
        <Loading className="h-16" />
      </div>
      <AuthRedirect domains={domains} />
    </section>
  );
}
