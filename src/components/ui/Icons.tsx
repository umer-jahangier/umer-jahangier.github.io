import { ArrowRight, ArrowUpRight, DownloadSimple, EnvelopeSimple, GithubLogo, LinkedinLogo } from "@phosphor-icons/react/dist/ssr";

export const IconMail = (p: { size?: number }) => <EnvelopeSimple size={p.size ?? 18} aria-hidden />;
export const IconDownload = (p: { size?: number }) => <DownloadSimple size={p.size ?? 18} aria-hidden />;
export const IconOut = (p: { size?: number }) => <ArrowUpRight size={p.size ?? 18} aria-hidden />;
export const IconNext = (p: { size?: number }) => <ArrowRight size={p.size ?? 18} aria-hidden />;
export const IconGithub = (p: { size?: number }) => <GithubLogo size={p.size ?? 20} aria-hidden />;
export const IconLinkedin = (p: { size?: number }) => <LinkedinLogo size={p.size ?? 20} aria-hidden />;
