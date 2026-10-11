import Link from "next/link";
import { ArrowLeft, ArrowRight } from "@/components/icons";

export default function NotFound() {
  return (
    <section className="error-page"><div className="site-container error-page__inner"><span className="error-page__code">404 · PAGE NOT FOUND</span><h1>This department or page could not be found.</h1><p>The page may have moved, or the address may not be correct.</p><div className="button-row"><Link className="button button--primary" href="/">Return to Homepage<ArrowLeft size={16} /></Link><Link className="button button--secondary" href="/doctors">Find a Doctor<ArrowRight size={16} /></Link></div></div></section>
  );
}
