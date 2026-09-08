"use client";

import { toast } from "sonner";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";

export default function DemoPage() {
    return (
        <div className="mx-auto flex max-w-5xl flex-col gap-16 px-4 py-16">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight">
                    컴포넌트 데모
                </h1>
                <p className="text-muted-foreground">
                    스타터킷에 포함된 shadcn/ui 컴포넌트 사용 예시입니다.
                </p>
            </div>

            <section className="flex flex-col gap-4">
                <h2 className="text-xl font-semibold">Buttons & Badges</h2>
                <div className="flex flex-wrap items-center gap-3">
                    <Button variant="default">Default</Button>
                    <Button variant="secondary">Secondary</Button>
                    <Button variant="outline">Outline</Button>
                    <Button variant="ghost">Ghost</Button>
                    <Button variant="destructive">Destructive</Button>
                    <Button variant="link">Link</Button>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                    <Button size="xs">xs</Button>
                    <Button size="sm">sm</Button>
                    <Button size="default">default</Button>
                    <Button size="lg">lg</Button>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                    <Badge>Default</Badge>
                    <Badge variant="secondary">Secondary</Badge>
                    <Badge variant="outline">Outline</Badge>
                    <Badge variant="destructive">Destructive</Badge>
                </div>
            </section>

            <section className="flex flex-col gap-4">
                <h2 className="text-xl font-semibold">Card</h2>
                <Card className="max-w-md">
                    <CardHeader>
                        <CardTitle>프로필 설정</CardTitle>
                        <CardDescription>
                            간단한 폼 요소를 카드 안에 배치한 예시입니다.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-4">
                        <div className="flex flex-col gap-1.5">
                            <Label htmlFor="demo-name">이름</Label>
                            <Input id="demo-name" placeholder="홍길동" />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <Label htmlFor="demo-bio">소개</Label>
                            <Textarea id="demo-bio" placeholder="간단한 소개를 입력하세요" />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <Label htmlFor="demo-role">역할</Label>
                            <Select defaultValue="developer">
                                <SelectTrigger id="demo-role">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="developer">개발자</SelectItem>
                                    <SelectItem value="designer">디자이너</SelectItem>
                                    <SelectItem value="pm">기획자</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex items-center justify-between">
                            <Label htmlFor="demo-notify">알림 받기</Label>
                            <Switch id="demo-notify" defaultChecked />
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button className="w-full">저장</Button>
                    </CardFooter>
                </Card>
            </section>

            <section className="flex flex-col gap-4">
                <h2 className="text-xl font-semibold">Overlays</h2>
                <div className="flex flex-wrap items-center gap-3">
                    <Dialog>
                        <DialogTrigger render={<Button variant="outline" />}>
                            다이얼로그 열기
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>정말 진행하시겠습니까?</DialogTitle>
                                <DialogDescription>
                                    이 작업은 되돌릴 수 없습니다.
                                </DialogDescription>
                            </DialogHeader>
                            <DialogFooter>
                                <DialogClose render={<Button variant="outline" />}>
                                    취소
                                </DialogClose>
                                <DialogClose render={<Button />}>
                                    확인
                                </DialogClose>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>

                    <DropdownMenu>
                        <DropdownMenuTrigger render={<Button variant="outline" />}>
                            드롭다운 메뉴
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuItem>프로필</DropdownMenuItem>
                            <DropdownMenuItem>설정</DropdownMenuItem>
                            <DropdownMenuItem>로그아웃</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </section>

            <section className="flex flex-col gap-4">
                <h2 className="text-xl font-semibold">Navigation / Info</h2>
                <Tabs defaultValue="account" className="max-w-md">
                    <TabsList>
                        <TabsTrigger value="account">계정</TabsTrigger>
                        <TabsTrigger value="password">비밀번호</TabsTrigger>
                    </TabsList>
                    <TabsContent value="account" className="pt-3 text-sm text-muted-foreground">
                        계정 관련 설정을 이곳에서 관리합니다.
                    </TabsContent>
                    <TabsContent value="password" className="pt-3 text-sm text-muted-foreground">
                        비밀번호 변경은 이곳에서 진행합니다.
                    </TabsContent>
                </Tabs>

                <div className="flex items-center gap-3">
                    <Avatar>
                        <AvatarFallback>SK</AvatarFallback>
                    </Avatar>
                    <Separator orientation="vertical" className="h-8" />
                    <span className="text-sm text-muted-foreground">
                        Avatar와 Separator 조합 예시
                    </span>
                </div>
            </section>

            <section className="flex flex-col gap-4">
                <h2 className="text-xl font-semibold">Feedback</h2>
                <Button
                    variant="outline"
                    onClick={() =>
                        toast.success("저장되었습니다.", {
                            description: "변경 사항이 정상적으로 반영되었습니다.",
                        })
                    }
                >
                    토스트 알림 띄우기
                </Button>
            </section>
        </div>
    );
}
