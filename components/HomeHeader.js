import { useSession } from "next-auth/react";

export default function HomeHeader() {

    const { data: session } = useSession();

    return (

        <div className='text=blue-900 flex justify-between'>
            <h2 className="mt-0">
                <div className="flex gap-3 items-center">
                    <img className='w-6 h-6 rounded-md sm:hidden' src={session?.user?.image} alt='' />
                    <div>
                    Olá, <b>{session?.user?.name}</b>
                    </div>    
                </div>
            </h2>
            <div className="hidden sm:block">
                <div className='bg-gray-300 flex  text-black rounded-lg overflow-hidden'>
                    <img className='w-6 h-6' src={session?.user?.image} alt='' />
                    <span className='px-2 '>
                        {session?.user?.name}
                    </span>
                </div>
            </div>
        </div>
    )
}