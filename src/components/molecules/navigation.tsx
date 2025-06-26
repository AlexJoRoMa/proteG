import Link from "next/link";

export default function Navigation() {
    return (
        <nav id='navigation-bar' className='flex flex-row w-full justify-between gap-[8] h-fit mx-[20]'>
            <Link href="/" className="hover:underline">Home</Link>
            <Link href="/tv" className="hover:underline">Tv</Link>
            <Link href="/movil" className="hover:underline">Móvil</Link>
            <Link href="/internet" className="hover:underline">Internet</Link>
        </nav>
    )
}