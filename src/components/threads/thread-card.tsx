"use client"

import React from 'react'
import Link from 'next/link'
import { toast } from 'sonner'
import { Separator } from '@/components/ui/separator'
import { Plus } from 'lucide-react'
import { Icons } from '@/components/icons'
import { cn, formatTimeAgo } from '@/lib/utils'
import { api } from '@/trpc/react'
import { useUser } from '@clerk/nextjs'
import { ThreadCardProps } from '@/types'
import CreateThread from '@/components/threads/create-thread'
import RepliesImageContainer from '@/components/threads/replies-image-container'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
    Dialog,
    DialogContent,
    DialogTrigger,
} from "@/components/ui/dialog"
import ProfileInfoCard from '@/components/threads/profile-info-card'
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card"
import PostMenu from '@/components/buttons/post-menu'
import ShareButton from '../buttons/share-button'
import RepostButton from '../buttons/repost-button'

const ThreadCard: React.FC<ThreadCardProps> = ({
    id,
    text,
    createdAt,
    likes,
    replies,
    author,
    count,
}) => {

    const { user: loggedUser } = useUser()

    const isLikedByMe = likes.some((like: any) =>
        like?.userId || like?.user?.id === loggedUser?.id
    );

    const getThreadReplies = replies?.map((reply) => ({
        id: reply.author.id,
        username: reply.author.username,
        image: reply.author.image,
    }));

    const { likeCount, replyCount } = count

    const likeUpdate = React.useRef({
        isLikedByMe,
        likeCount
    });

    const { mutate: toggleLike, isLoading } = api.post.toggleLike.useMutation({
        onMutate: async () => {

            // Save the current values for potential rollback
            const previousLikedByMe = likeUpdate.current.isLikedByMe;
            const previousLikeCount = likeUpdate.current.likeCount;

            likeUpdate.current.isLikedByMe = !likeUpdate.current.isLikedByMe;
            likeUpdate.current.likeCount = likeUpdate.current.isLikedByMe ? likeUpdate.current.likeCount + 1 : likeUpdate.current.likeCount - 1;


            return { previousLikedByMe, previousLikeCount };

        },
        onError: (error, variables, context) => {

            // Rollback to previous values
            likeUpdate.current.isLikedByMe = context?.previousLikedByMe!;
            likeUpdate.current.likeCount = context?.previousLikeCount!;

            toast.error("LikeCallBack: Something went wrong!")

        },
    });

    return (
        <>
            <Separator />

            <div className='flex w-full gap-2 pt-4'>
                <div className="flex flex-col items-center gap-1.5 ">
                    <Dialog>
                        <DialogTrigger asChild>
                            <button className='relative '>
                                <div className='h-9 w-9 outline outline-1 outline-[#333333] rounded-full'>
                                    <Avatar className="rounded-full w-full h-full">
                                        <AvatarImage src={author.image} alt={author.username} />
                                        <AvatarFallback>{author.username?.slice(0, 2).toUpperCase()}</AvatarFallback>
                                    </Avatar>
                                </div>
                                <div className='bg-foreground absolute -bottom-0.5 -right-0.5  rounded-2xl border-2 border-background text-background hover:scale-105 active:scale-95'>
                                    <Plus className='h-4 w-4 p-0.5' />
                                </div>
                            </button>
                        </DialogTrigger>
                        <DialogContent className='max-w-[360px] w-full p-0 rounded-2xl  border-none'>
                            <ProfileInfoCard {...author} />
                        </DialogContent>
                    </Dialog>

                    {replyCount > 0 &&
                        <div className="h-full w-0.5 bg-[#333638] rounded-full my-[1px]" />
                    }

                </div>

                <div className="flex flex-col w-full px-2">
                    <div className="justify-center items-start self-stretch flex flex-col max-md:max-w-full  ">
                        <div className="justify-center items-start flex w-full flex-col  pt-0 self-start">
                            <div className="items-start flex w-full justify-between gap-5 py-px self-start max-md:max-w-full max-md:flex-wrap ">
                                <HoverCard>
                                    <HoverCardTrigger asChild>
                                        <Link href={`/@${author.username}`} className="flex items-center justify-center gap-1.5 cursor-pointer hover:underline">
                                            <h1 className="text-white text-[15px] font-semibold leading-[0px]">
                                                {author.username}
                                            </h1>
                                            <Icons.verified className='w-3 h-3' />
                                        </Link>
                                    </HoverCardTrigger>
                                    <HoverCardContent align={"start"} sideOffset={10} className="w-[360px] p-0 rounded-2xl bg-transparent border-none">
                                        <ProfileInfoCard {...author} />
                                    </HoverCardContent>
                                </HoverCard>
                                <div className="justify-between items-center self-stretch flex gap-3">
                                    <time className="text-right text-[15px] leading-none self-stretch  text-[#777777] cursor-default">
                                        {formatTimeAgo(createdAt)}
                                    </time>
                                    <PostMenu id={author.id} />
                                </div>
                            </div>

                            <Link href={`/@${author.username}/post/${id}`} className='w-full'>
                                <div className="text-white text-[15px] leading-5 mt-1 max-md:max-w-full">
                                    {text}
                                </div>
                            </Link>

                            <div className="flex  font-bold -ml-2 mt-2 w-full">
                                <div className='flex items-center justify-center hover:bg-[#1E1E1E] rounded-full p-2 w-fit h-fit active:scale-95'>
                                    <button disabled={isLoading}>
                                        <Icons.heart
                                            onClick={() => {
                                                toggleLike({ id })
                                            }}
                                            fill={likeUpdate.current.isLikedByMe ? '#ff3040' : 'none'}
                                            className={cn('w-5 h-5 ', {
                                                "text-[#ff3040]": likeUpdate.current.isLikedByMe
                                            })} />
                                    </button>
                                </div>
                                <CreateThread
                                    showIcon={true}
                                    replyThreadInfo={{
                                        id,
                                        text,
                                        author: {
                                            id: author.id,
                                            image: author.image,
                                            username: author.username
                                        }
                                    }} />
                                <RepostButton id={id} />
                                <ShareButton id={id} author={author.username} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>


            <div className={cn('flex items-center select-none pb-2', {
                " gap-2 pb-4 ": replyCount > 0 || likeUpdate.current.likeCount > 0
            })}>

                <div className={cn("flex invisible justify-center items-center w-[36px] ", {
                    "visible": replyCount > 0
                })}>
                    <RepliesImageContainer author={getThreadReplies} />
                </div>

                <Link
                    href={`/@${author.username}/post/${id}`}
                    className="flex items-center gap-2 text-[#777777] text-[15px] text-center px-2">

                    {replyCount > 0 && (
                        <p className='hover:underline '>
                            {replyCount} {replyCount === 1 ? 'reply' : 'replies'}
                        </p>
                    )}

                    {replyCount > 0 && likeUpdate.current.likeCount > 0 && <p> · </p>}

                    {likeUpdate.current.likeCount > 0 && (
                        <p className='hover:underline'>
                            {likeUpdate.current.likeCount} {likeUpdate.current.likeCount === 1 ? 'like' : 'likes'}
                        </p>
                    )}

                </Link>
            </div >
        </>
    )
}

export default ThreadCard