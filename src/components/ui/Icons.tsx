import { ArrowDownRight, ArrowUpRight, DownloadSimple, EnvelopeSimple, GithubLogo, LinkedinLogo } from "@phosphor-icons/react/dist/ssr";

const sw = 1.75;
export const IconMail = (p: { size?: number }) => <EnvelopeSimple size={p.size ?? 18} weight="regular" style={{ strokeWidth: sw }} aria-hidden />;
export const IconDownload = (p: { size?: number }) => <DownloadSimple size={p.size ?? 18} weight="regular" aria-hidden />;
export const IconOut = (p: { size?: number }) => <ArrowUpRight size={p.size ?? 18} weight="regular" aria-hidden />;
export const IconDown = (p: { size?: number }) => <ArrowDownRight size={p.size ?? 18} weight="regular" aria-hidden />;
export const IconGithub = (p: { size?: number }) => <GithubLogo size={p.size ?? 20} weight="regular" aria-hidden />;
export const IconLinkedin = (p: { size?: number }) => <LinkedinLogo size={p.size ?? 20} weight="regular" aria-hidden />;
