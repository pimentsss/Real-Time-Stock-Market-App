import Link from "next/link";

export default function FooterLink({ text, linkText, href }: { text: string; linkText: string; href: string }) {
  return (
    <div className="pt-4 text-center">
      <p className="text-sm text-gray-500">
        {text}{" "}
        <Link href={href} className="font-medium text-yellow-400 hover:underline">{linkText}</Link>
      </p>
    </div>
  );
}
