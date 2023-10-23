"use client"

import React from 'react'
import { Label } from '@/components/ui/label'
import { Globe, Lock, Plus, User2 } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Textarea } from '../ui/textarea'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { Card } from '../ui/card'
import { useUser } from '@clerk/nextjs'
import { RadioGroup, RadioGroupItem } from '../ui/radio-group'
import { emailToUsername } from '@/lib/utils'

export default function AccountSetupForm() {
    const { user } = useUser()
    const username = emailToUsername(user!)
    console.log("username", username)
    const [showPrivacyPage, setShowPrivacyPage] = React.useState(false);

    const [userAccountData, setUserAccountData] = React.useState({
        username,
        bio: "",
        link: "",
        public: true
    });

    console.log("userAccountData?", userAccountData)

    // ---------------- For textarea autoresize----------------- //
    const textAreaRef = React.useRef<HTMLTextAreaElement>();
    function updateTextAreaSize(textArea?: HTMLTextAreaElement) {
        if (textArea == null) return;
        textArea.style.height = "0";
        textArea.style.height = `${textArea.scrollHeight}px`;
    }
    const inputRef = React.useCallback((textArea: HTMLTextAreaElement) => {
        updateTextAreaSize(textArea);
        textAreaRef.current = textArea;
    }, []);
    React.useLayoutEffect(() => {
        updateTextAreaSize(textAreaRef.current);
    }, [userAccountData.bio]);
    // ---------------- For textarea autoresize----------------- //

    const handleFieldChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setUserAccountData({
            ...userAccountData,
            [name]: value,
        });
    };

    React.useEffect(() => {
        if (user) {
            setUserAccountData((prevData) => ({ ...prevData, username }));
        }
    }, [user]);

    return (
        !showPrivacyPage
            ? (
                <div className='flex flex-col gap-1 justify-center items-center w-full'>
                    <h2 className="scroll-m-20 tracking-wide text-4xl font-bold">
                        Profile
                    </h2>
                    <p className="leading-7 text-muted-foreground ">
                        Customize your Threads profile
                    </p>

                    <Card className='w-full p-6 px-8 bg-transparent rounded-2xl my-4 sm:mt-10'>
                        <div className="flex flex-col gap-4">
                            <div className='flex justify-between items-center'>
                                <div className='w-full'>
                                    <Label htmlFor="username">Name</Label>
                                    <div className=" flex items-center gap-2  w-full my-1 h-7">
                                        <Lock className="h-4 w-4 text-[#4D4D4D]" />
                                        <input
                                            name='username'
                                            className="flex-grow resize-none overflow-hidden outline-none text-[15px] text-accent-foreground break-words tracking-wide w-full bg-transparent"
                                            placeholder="name and username"
                                            value={`${user?.firstName} ${user?.lastName}${" "}(${username})`}
                                        />
                                    </div>
                                </div>
                                <div className='h-12 w-12'>
                                    <Avatar className=" h-full w-full relative overflow-visible">
                                        <AvatarImage src={user?.imageUrl} alt="Avatar" className='rounded-full' />
                                        <AvatarFallback>
                                            <User2 className='h-5 w-5' />
                                        </AvatarFallback>
                                    </Avatar>
                                </div>
                            </div>
                            <Label htmlFor="bio">Bio</Label>
                            <div className='flex gap-2 '>
                                <Plus className="h-4 w-4 text-[#4D4D4D] mt-1" />
                                <Textarea
                                    name='bio'
                                    className='outline-none border-0  ring-0  focus-visible:ring-offset-0 resize-none min-h-min focus-visible:ring-0 p-0 bg-transparent rounded-none '
                                    ref={inputRef}
                                    style={{ height: 0 }}
                                    placeholder="Write bio"
                                    value={userAccountData.bio}
                                    onChange={handleFieldChange} />
                            </div>
                            <div className="grid gap-2 mt-1">
                                <Label htmlFor="link">Link</Label>
                                <div className=" flex items-center gap-2  my-1 h-7">
                                    <Plus className="h-4 w-4 text-[#4D4D4D]" />
                                    <Input
                                        name='link'
                                        className="outline-none border-0  ring-0  focus-visible:ring-offset-0 resize-none min-h-min focus-visible:ring-0 p-0 bg-transparent rounded-none"
                                        placeholder="Add link"
                                        value={userAccountData.link}
                                        onChange={handleFieldChange}
                                    />
                                </div>
                            </div>

                        </div>
                    </Card>
                    <Button className='w-full' onClick={() => setShowPrivacyPage(true)}>Continue &rarr;</Button>

                </div>
            ) : (
                <div className='flex flex-col gap-1 justify-center items-center w-full'>
                    <h2 className="scroll-m-20 tracking-wide text-4xl font-bold">
                        Privacy
                    </h2>
                    <p className="leading-7 text-muted-foreground ">
                        Your privacy can be different on Threads and Instagarm.
                    </p>

                    <RadioGroup defaultValue="public" className="flex flex-col gap-3 w-full mt-6 sm:mt-10">
                        <div>
                            <RadioGroupItem value="public" id="public" className="peer sr-only" />
                            <Label
                                htmlFor="public"
                                className="flex flex-col  rounded-xl border-2 border-muted  px-6 py-5 bg-transparent peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary font-normal text-sm text-muted-foreground"
                                onClick={() => (
                                    setUserAccountData({
                                        ...userAccountData,
                                        public: true,
                                    })
                                )}
                            >
                                <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <h1 className="text-base font-medium">
                                        Public profile
                                    </h1>
                                    <Globe className='w-5 h-5' />
                                </div>
                                <p>
                                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Facere recusandae corporis voluptas culpa quibusdam qui.
                                </p>
                            </Label>
                        </div>
                        <div>
                            <RadioGroupItem value="private" id="private" className="peer sr-only" />
                            <Label
                                htmlFor="private"
                                className="flex flex-col  rounded-xl border-2 border-muted  px-6 py-5 bg-transparent peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary font-normal text-sm text-muted-foreground"
                                onClick={() => (
                                    setUserAccountData({
                                        ...userAccountData,
                                        public: false,
                                    })
                                )}
                            >
                                <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <h1 className="text-base font-medium">
                                        Private profile
                                    </h1>
                                    <Lock className='w-5 h-5' />
                                </div>
                                <p>
                                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Facere recusandae corporis voluptas culpa quibusdam qui.
                                </p>
                            </Label>
                        </div>
                    </RadioGroup>
                    <Button className='w-full mt-4' onClick={() => setShowPrivacyPage(true)}>Create my profile</Button>
                </div >
            )
    )
}
