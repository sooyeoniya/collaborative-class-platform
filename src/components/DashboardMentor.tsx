
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Plus, Users, BookOpen, Settings, LogOut, Link2, Calendar as CalendarLucide } from "lucide-react";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { cn } from "@/lib/utils";

interface DashboardMentorProps {
  userName: string;
  onLogout: () => void;
}

interface ClassSpace {
  id: string;
  name: string;
  description: string;
  startDate: Date;
  endDate: Date;
  category: string;
  participantCount: number;
  inviteCode: string;
  dailySheets: DailySheet[];
}

interface DailySheet {
  id: string;
  date: Date;
  title: string;
  rows: SheetRow[];
  isActive: boolean;
}

interface SheetRow {
  id: string;
  title: string;
  description: string;
  isVisible: boolean;
  order: number;
}

const DashboardMentor = ({ userName, onLogout }: DashboardMentorProps) => {
  const [classSpaces, setClassSpaces] = useState<ClassSpace[]>([
    {
      id: '1',
      name: '우아한테크코스 레벨1',
      description: '자바스크립트와 웹 프로그래밍 기초',
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-02-29'),
      category: '프로그래밍',
      participantCount: 15,
      inviteCode: 'WOOWA2024',
      dailySheets: [
        {
          id: '1',
          date: new Date('2024-01-15'),
          title: '1주차 - 자바스크립트 기초',
          isActive: true,
          rows: [
            { id: '1', title: '체크인 점수', description: '오늘의 컨디션을 1-10점으로', isVisible: true, order: 1 },
            { id: '2', title: '질문', description: '궁금한 점이 있다면', isVisible: true, order: 2 },
            { id: '3', title: '토론 주제', description: '함께 논의하고 싶은 내용', isVisible: false, order: 3 }
          ]
        }
      ]
    }
  ]);

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newSpaceName, setNewSpaceName] = useState('');
  const [newSpaceDescription, setNewSpaceDescription] = useState('');
  const [newSpaceCategory, setNewSpaceCategory] = useState('');
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();

  const handleCreateSpace = () => {
    if (newSpaceName && newSpaceDescription && startDate && endDate) {
      const newSpace: ClassSpace = {
        id: Date.now().toString(),
        name: newSpaceName,
        description: newSpaceDescription,
        startDate,
        endDate,
        category: newSpaceCategory || '기타',
        participantCount: 0,
        inviteCode: `EDU${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
        dailySheets: []
      };
      
      setClassSpaces([...classSpaces, newSpace]);
      setIsCreateDialogOpen(false);
      setNewSpaceName('');
      setNewSpaceDescription('');
      setNewSpaceCategory('');
      setStartDate(undefined);
      setEndDate(undefined);
    }
  };

  const generateInviteLink = (inviteCode: string) => {
    return `${window.location.origin}?invite=${inviteCode}`;
  };

  const copyInviteLink = (inviteCode: string) => {
    navigator.clipboard.writeText(generateInviteLink(inviteCode));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 gradient-mentor rounded-xl flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">멘토 대시보드</h1>
              <p className="text-gray-600">안녕하세요, {userName}님!</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4 mr-2" />
              설정
            </Button>
            <Button variant="outline" size="sm" onClick={onLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              로그아웃
            </Button>
          </div>
        </header>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{classSpaces.length}</p>
                  <p className="text-sm text-gray-600">운영 중인 수업</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {classSpaces.reduce((sum, space) => sum + space.participantCount, 0)}
                  </p>
                  <p className="text-sm text-gray-600">총 참여자 수</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <CalendarLucide className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {classSpaces.reduce((sum, space) => sum + space.dailySheets.length, 0)}
                  </p>
                  <p className="text-sm text-gray-600">생성된 시트</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Class Spaces */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">수업 공간</h2>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gradient-mentor text-white hover:opacity-90">
                <Plus className="w-4 h-4 mr-2" />
                새 수업 공간 만들기
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>새 수업 공간 만들기</DialogTitle>
                <DialogDescription>
                  수업 공간의 기본 정보를 입력해주세요
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="space-name">수업명</Label>
                  <Input
                    id="space-name"
                    placeholder="예: 우아한테크코스 레벨2"
                    value={newSpaceName}
                    onChange={(e) => setNewSpaceName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="space-description">수업 설명</Label>
                  <Textarea
                    id="space-description"
                    placeholder="수업에 대한 간단한 설명을 입력해주세요"
                    value={newSpaceDescription}
                    onChange={(e) => setNewSpaceDescription(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="space-category">카테고리</Label>
                  <Input
                    id="space-category"
                    placeholder="예: 프로그래밍, 디자인, 마케팅"
                    value={newSpaceCategory}
                    onChange={(e) => setNewSpaceCategory(e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>시작일</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !startDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {startDate ? format(startDate, "PPP", { locale: ko }) : "날짜 선택"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={startDate}
                          onSelect={setStartDate}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="space-y-2">
                    <Label>종료일</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !endDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {endDate ? format(endDate, "PPP", { locale: ko }) : "날짜 선택"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={endDate}
                          onSelect={setEndDate}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
                <Button onClick={handleCreateSpace} className="w-full">
                  수업 공간 만들기
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-6">
          {classSpaces.map((space) => (
            <Card key={space.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{space.name}</CardTitle>
                    <CardDescription className="mt-2">{space.description}</CardDescription>
                    <div className="flex items-center gap-2 mt-3">
                      <Badge variant="secondary">{space.category}</Badge>
                      <Badge variant="outline">
                        <Users className="w-3 h-3 mr-1" />
                        {space.participantCount}명 참여
                      </Badge>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyInviteLink(space.inviteCode)}
                    >
                      <Link2 className="w-4 h-4 mr-2" />
                      초대 링크 복사
                    </Button>
                    <div className="text-right text-sm text-gray-500">
                      <p>초대 코드: <code className="bg-gray-100 px-1 rounded">{space.inviteCode}</code></p>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center text-sm text-gray-600 mb-4">
                  <span>
                    {format(space.startDate, "yyyy.MM.dd", { locale: ko })} ~ {format(space.endDate, "yyyy.MM.dd", { locale: ko })}
                  </span>
                  <span>데일리 시트 {space.dailySheets.length}개</span>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <CalendarLucide className="w-4 h-4 mr-2" />
                    데일리 시트 관리
                  </Button>
                  <Button variant="outline" size="sm">
                    <Users className="w-4 h-4 mr-2" />
                    참여자 관리
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
          
          {classSpaces.length === 0 && (
            <Card className="text-center py-12">
              <CardContent>
                <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">아직 생성된 수업 공간이 없습니다.</p>
                <Button
                  onClick={() => setIsCreateDialogOpen(true)}
                  className="gradient-mentor text-white hover:opacity-90"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  첫 번째 수업 공간 만들기
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardMentor;
