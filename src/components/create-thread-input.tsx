"use client"

import React from 'react'
import NSFWFilter from 'nsfw-filter';
import useFileStore from '@/store/fileStore';
import { EyeOff, X } from 'lucide-react'
import Username from '@/components/threads/username';
import { ResizeTextarea } from '@/components/ui/resize-textarea'
import { cn } from '@/lib/utils';
import UserAvatar from '@/components/user-avatar';
import { useUser } from '@clerk/nextjs';
import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { ParentThreadInfo } from '@/components/threads/create-thread';
import {
    useDropzone,
    type Accept,
} from "react-dropzone";

interface CreateThreadInputProps {
    isOpen: boolean
    replyThreadInfo?: ParentThreadInfo
    onTextareaChange: (textValue: string) => void;
}

const CreateThreadInput: React.FC<CreateThreadInputProps> = ({
    isOpen,
    replyThreadInfo,
    onTextareaChange
}) => {
    const { user } = useUser()
    const { setSelectedFile, setIsSelectedImageSafe } = useFileStore();

    const [inputValue, setInputValue] = React.useState('')
    const [isSafeImage, setIsSafeImage] = React.useState(false)

    const handleResizeTextareaChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newValue = event.target.value;
        setInputValue(newValue)
        onTextareaChange(newValue);
    };

    const [previewURL, setPreviewURL] = React.useState<string | undefined>(undefined)

    const maxSize = 4 * 1024 * 1024;

    const onDrop = React.useCallback(
        async (acceptedFiles: File[]) => {
            const acceptedFile = acceptedFiles[0];

            if (!acceptedFile) {
                alert('Selected image is too large!');
                return;
            }

            const isSafe = await NSFWFilter.isSafe(acceptedFile);
            setIsSafeImage(isSafe)

            setIsSelectedImageSafe(isSafe)
            setSelectedFile(acceptedFiles);

            const previewURL = URL.createObjectURL(acceptedFile)
            setPreviewURL(previewURL)
        }, [maxSize]
    );

    const accept: Accept = {
        "image/*": [],
    }

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept,
        maxSize,
    })

    const scrollDownRef = React.useRef<HTMLDivElement | null>(null)

    React.useEffect(() => {
        scrollDownRef.current?.scrollIntoView({
            behavior: 'smooth',
            block: 'nearest',
            inline: 'start'
        })
    }, [isOpen])

    return (
        <div className={cn('flex space-x-3', {
            'mt-1': !replyThreadInfo
        })}>

            <div className='relative flex flex-col items-center'>

                {replyThreadInfo
                    ? <UserAvatar
                        image={replyThreadInfo.author.image}
                        username={replyThreadInfo.author.username}
                        fullname={replyThreadInfo.author.fullname} />
                    : <UserAvatar
                        image={user?.imageUrl}
                        username={user?.username ?? ''}
                        fullname={user?.fullName} />
                }

                {replyThreadInfo?.text
                    && <div className="h-full w-0.5 bg-[#313639] rounded-full mt-1.5 my-1" />
                }

            </div>

            <div className='flex flex-col w-full gap-1.5 pb-4'>

                {replyThreadInfo ? (
                    <div className='flex'>
                        <Username author={replyThreadInfo?.author} />

                        {/* TODO: This is temp solution to maintain layout */}
                        <div className='w-3 h-3 invisible'>
                            <Icons.verified className='w-3 h-3' />
                        </div>
                    </div>
                ) : (
                    <p className="text-[15px] font-medium leading-none tracking-normal">
                        {user?.username}
                    </p>
                )}

                {replyThreadInfo ? (
                    <>
                        <p className='flex-grow resize-none overflow-hidden outline-none text-[15px] text-accent-foreground break-words placeholder:text-[#777777] w-full tracking-normal whitespace-pre-line'>
                            <div dangerouslySetInnerHTML={{
                                __html: replyThreadInfo.text.slice(1, -1).replace(/\\n/g, '\n')
                            }} />
                        </p>
                        {replyThreadInfo.images[0] &&
                            <div className='relative overflow-hidden rounded-[12px] border border-[#393939] w-fit'>
                                <img
                                    src={replyThreadInfo.images[0]}
                                    alt={`${replyThreadInfo.author.fullname}'s post image`}
                                    className='object-contain max-h-[520px] max-w-full rounded-[12px]' />
                            </div>
                        }
                    </>
                ) : (
                    <>
                        <ResizeTextarea
                            name='text'
                            value={inputValue}
                            onChange={handleResizeTextareaChange}
                            placeholder="Start a thread..."
                            maxLength={200}
                        />
                        {previewURL && (
                            <div className='relative overflow-hidden rounded-[12px] border border-[#393939] w-fit'>
                                <img
                                    src={previewURL}
                                    alt=""
                                    className='object-contain max-h-[520px] max-w-full rounded-[12px]' />
                                {!isSafeImage &&
                                    <div className='absolute top-0 left-0 w-full h-full backdrop-blur-xl flex justify-center items-center'>
                                        <EyeOff className='h-8 w-8 text-[#3b3b3b]' />
                                    </div>
                                }
                                <Button
                                    onClick={() => setPreviewURL('')}
                                    variant={"ghost"}
                                    className="h-6 w-6 p-1 absolute top-2 right-2 z-50 rounded-full bg-black/80 transform active:scale-75 transition-transform cursor-pointer" >
                                    <X />
                                </Button>
                            </div>
                        )}
                    </>
                )}

                {!replyThreadInfo?.text &&
                    <div {...getRootProps()}
                        ref={scrollDownRef}
                        className='space-y-2 mt-1 select-none w-fit'>
                        <div className='text-[#777777] flex gap-1 select-none items-center text-[15px]'>
                            <input {...getInputProps()} />
                            <Icons.image className='h-5 w-5 select-none transform active:scale-75 transition-transform cursor-pointer' />
                        </div>
                    </div>
                }

            </div>
        </div>
    )
}

export default CreateThreadInput