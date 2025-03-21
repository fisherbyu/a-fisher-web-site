import Image from 'next/image';
import GitHubIcon from '@/public/core/github.svg';
import LinkedInIcon from '@/public/core/linkedin.svg';
import { Separator } from '@/components/ui/separator';
import AFLogo from '@/public/core/af-logo.svg';
import Link from 'next/link';

export default function CoreFooter() {
    return (
        <footer className="container mx-auto">
            <Separator />
            <div className=" py-12 mx-auto overflow-hidden max-w-7xl ">
                <p className="mt-8 text-center">
                    <Link href="/">
                        <Image src={AFLogo} alt="AF" className="mx-auto" />
                    </Link>
                    <span className="mx-auto mt-2 text-sm text-gray-500">Created by Andrew Fisher</span>
                </p>
                <div className="flex justify-center mt-8 space-x-6">
                    <span className="inline-flex justify-center w-full gap-3 m-auto md:justify-start md:w-auto">
                        <a href="https://github.com/fisherbyu" className="w-6 h-6 transition fill-black hover:text-blue-500">
                            <span className="sr-only">github</span>
                            <Image src={GitHubIcon} alt="git-hub logo" />
                        </a>
                        <a
                            href="https://www.linkedin.com/in/fisherandrew777/"
                            className="w-6 h-6 transition fill-black hover:text-blue-500"
                        >
                            <span className="sr-only">Linkedin</span>
                            <Image src={LinkedInIcon} alt="LinkedIn Logo" />
                        </a>
                    </span>
                </div>
            </div>
        </footer>
    );
}
