import Link from "next/link";
import { ArrowUpRight, Mail, ShieldCheck } from "lucide-react";

const SUPPORT_EMAIL = "support@credisense.com";

const footerLinks = [
  { label: "How it works", href: "#how-it-works" },
  { label: "Our model", href: "#model" },
  { label: "Responsible AI", href: "#responsible-ai" },
];

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-blue-100 bg-white">
      {/* Soft blue gradient */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-blue-50/80 via-white to-cyan-50/70" />

      <div className="pointer-events-none absolute -top-32 right-1/4 size-72 rounded-full bg-blue-200/30 blur-[100px]" />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        {/* Main footer */}
        <div className="grid gap-10 py-10 md:grid-cols-[1.5fr_1fr_1fr] md:gap-12">
          {/* Brand */}
          <div className="max-w-sm">
            <Link
              href="/"
              aria-label="CrediSense home"
              className="inline-flex items-center gap-2.5"
            >
              <span className="flex size-9 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md shadow-blue-600/20">
                <ShieldCheck size={21} />
              </span>

              <span className="text-lg font-bold tracking-tight text-slate-950">
                CrediSense
              </span>
            </Link>

            <p className="mt-4 text-sm leading-6 text-slate-500">
              AI-powered credit risk assessment that turns applicant data into
              meaningful insights for more informed lending decisions.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-900">
              Explore
            </h3>

            <nav
              className="mt-4 flex flex-col gap-3"
              aria-label="Footer navigation"
            >
              {footerLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="w-fit text-sm text-slate-500 transition-colors hover:text-blue-600"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-900">
              Support
            </h3>

            <p className="mt-4 text-sm leading-6 text-slate-500">
              Questions or feedback? Get in touch with us.
            </p>

            <a
              href={`mailto:${SUPPORT_EMAIL}`}
              className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-blue-600 transition-colors hover:text-blue-700"
            >
              <Mail size={15} />
              {SUPPORT_EMAIL}
              <ArrowUpRight size={13} />
            </a>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col gap-3 border-t border-blue-100 py-5 sm:flex-row sm:items-center sm:justify-between ">
          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} CrediSense. All rights reserved.
          </p>

          
        </div>
      </div>
    </footer>
  );
}
