import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from './ui/dropdown-menu'
import { Icons } from './icons'
import { useClerk } from "@clerk/nextjs"
import { useRouter } from 'next/navigation'

export default function MenuOptions() {
    const router = useRouter()
    const { signOut } = useClerk();
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <div>
                    <Icons.menu className='h-[22px] w-[22px] text-[#4B4B4B] focus:text-white cursor-pointer' />
                </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className='bg-[#181818] rounded-2xl max-w-sm w-full mt-1'>
                <DropdownMenuItem className='focus:bg-transparent px-5 tracking-normal font-semibold py-2'>
                    Switch appearance
                </DropdownMenuItem>
                <DropdownMenuSeparator className='bg-muted h-[1.2px] ' />
                <DropdownMenuItem className='focus:bg-transparent px-5 tracking-normal font-semibold py-2'>
                    About
                </DropdownMenuItem>
                <DropdownMenuSeparator className='bg-muted h-[1.2px]' />
                <DropdownMenuItem className='focus:bg-transparent px-5 tracking-normal font-semibold py-2'>
                    Report a problem
                </DropdownMenuItem>
                <DropdownMenuSeparator className='bg-muted h-[1.2px]' />
                <DropdownMenuItem className='focus:bg-transparent px-5 tracking-normal font-semibold py-2'>
                    <button
                        aria-label="Log out"

                        onClick={() => signOut(() => router.push("/"))}
                    >
                        Log out
                    </button>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
