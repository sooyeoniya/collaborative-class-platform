
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { BookOpen, Users, MessageSquare, Settings, LogOut, Plus, AlertCircle, Calendar } from "lucide-react";
import { format } from "date-fns";
import { ko } from "date-fns/locale";

interface DashboardStudentProps {
  userName: string;
  onLogout: () => void;
}

interface JoinedSpace {
  id: string;
  name: string;
  description: string;
  category: string;
  mentorName: string;
  participantCount: number;
  dailySheetsCount: number;
  lastActivity: Date;
  inviteCode: string;
}

const DashboardStudent = ({ userName, onLogout }: DashboardStudentProps) => {
  const [joinedSpaces, setJoinedSpaces] = useState<JoinedSpace[]>([
    {
      id: '1',
      name: '우아한테크코스 레벨1',
      description: '자바스크립트와 웹 프로그래밍 기초',
      category: '프로그래밍',
      mentorName: '김지훈',
      participantCount: 15,
      dailySheetsCount: 8,
      lastActivity: new Date('2024-01-15'),
      inviteCode: 'WOOWA2024'
    }
  ]);

  const [isJoinDialogOpen, setIsJoinDialogOpen] = useState(false);
  const [inviteCodeInput, setInviteCodeInput] = useState('');
  const [joinError, setJoinError] = useState('');

  // Mock available spaces that can be joined
  const availableSpaces = [
    {
      inviteCode: 'REACT2024',
      name: 'React 심화 스터디',
      description: 'React 고급 패턴과 최적화 기법',
      mentorName: '이지수',
      category: '프로그래밍'
    },
    {
      inviteCode: 'DESIGN101',
      name: 'UI/UX 디자인 기초',
      description: '사용자 경험을 고려한 디자인 사고',
      mentorName: '박민서',
      category: '디자인'
    }
  ];

  const handleJoinSpace = () => {
    setJoinError('');
    
    if (!inviteCodeInput.trim()) {
      setJoinError('초대 코드를 입력해주세요.');
      return;
    }

    const spaceToJoin = availableSpaces.find(
      space => space.inviteCode === inviteCodeInput.toUpperCase()
    );

    if (spaceToJoin) {
      const newJoinedSpace: JoinedSpace = {
        id: Date.now().toString(),
        name: spaceToJoin.name,
        description: spaceToJoin.description,
        category: spaceToJoin.category,
        mentorName: spaceToJoin.mentorName,
        participantCount: Math.floor(Math.random() * 20) + 5,
        dailySheetsCount: Math.floor(Math.random() * 10),
        lastActivity: new Date(),
        inviteCode: spaceToJoin.inviteCode
      };

      setJoinedSpaces([...joinedSpaces, newJoinedSpace]);
      setIsJoinDialogOpen(false);
      setInviteCodeInput('');
    } else {
      setJoinError('유효하지 않은 초대 코드입니다. 다시 확인해주세요.');
    }
  };

  const getActivityStatus = (lastActivity: Date) => {
    const daysDiff = Math.floor((new Date().getTime() - lastActivity.getTime()) / (1000 * 60 * 60 * 24));
    if (daysDiff === 0) return { text: '오늘', color: 'bg-green-100 text-green-800' };
    if (daysDiff === 1) return { text: '어제', color: 'bg-yellow-100 text-yellow-800' };
    return { text: `${daysDiff}일 전`, color: 'bg-gray-100 text-gray-800' };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 gradient-student rounded-xl flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">수강생 대시보드</h1>
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
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{joinedSpaces.length}</p>
                  <p className="text-sm text-gray-600">참여 중인 공간</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {joinedSpaces.reduce((sum, space) => sum + space.dailySheetsCount, 0)}
                  </p>
                  <p className="text-sm text-gray-600">참여한 시트</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <MessageSquare className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {joinedSpaces.filter(space => {
                      const daysDiff = Math.floor((new Date().getTime() - space.lastActivity.getTime()) / (1000 * 60 * 60 * 24));
                      return daysDiff <= 1;
                    }).length}
                  </p>
                  <p className="text-sm text-gray-600">활발한 공간</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Learning Spaces */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">참여 중인 학습 공간</h2>
          <Dialog open={isJoinDialogOpen} onOpenChange={setIsJoinDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gradient-student text-white hover:opacity-90">
                <Plus className="w-4 h-4 mr-2" />
                새 공간 참여하기
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>학습 공간 참여하기</DialogTitle>
                <DialogDescription>
                  멘토로부터 받은 초대 코드를 입력해주세요
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="invite-code">초대 코드</Label>
                  <Input
                    id="invite-code"
                    placeholder="예: WOOWA2024"
                    value={inviteCodeInput}
                    onChange={(e) => setInviteCodeInput(e.target.value)}
                    className="uppercase"
                  />
                </div>
                {joinError && (
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{joinError}</AlertDescription>
                  </Alert>
                )}
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium mb-2">체험 가능한 초대 코드:</h4>
                  <ul className="text-sm space-y-1 text-blue-700">
                    <li>• <code className="bg-white px-1 rounded">REACT2024</code> - React 심화 스터디</li>
                    <li>• <code className="bg-white px-1 rounded">DESIGN101</code> - UI/UX 디자인 기초</li>
                  </ul>
                </div>
                <Button onClick={handleJoinSpace} className="w-full">
                  참여하기
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-6">
          {joinedSpaces.map((space) => {
            const activity = getActivityStatus(space.lastActivity);
            return (
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
                        <Badge className={activity.color}>
                          마지막 활동: {activity.text}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right text-sm text-gray-500">
                      <p className="font-medium">멘토: {space.mentorName}</p>
                      <p>시트 {space.dailySheetsCount}개</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2">
                    <Button variant="default" size="sm" className="gradient-student text-white hover:opacity-90">
                      <BookOpen className="w-4 h-4 mr-2" />
                      학습하기
                    </Button>
                    <Button variant="outline" size="sm">
                      <MessageSquare className="w-4 h-4 mr-2" />
                      채팅 확인
                    </Button>
                    <Button variant="outline" size="sm">
                      <Calendar className="w-4 h-4 mr-2" />
                      시트 보기
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
          
          {joinedSpaces.length === 0 && (
            <Card className="text-center py-12">
              <CardContent>
                <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">아직 참여 중인 학습 공간이 없습니다.</p>
                <Button
                  onClick={() => setIsJoinDialogOpen(true)}
                  className="gradient-student text-white hover:opacity-90"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  첫 번째 공간 참여하기
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Recent Activity */}
        {joinedSpaces.length > 0 && (
          <div className="mt-12">
            <h3 className="text-lg font-semibold mb-4">최근 활동</h3>
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {joinedSpaces.map((space) => (
                    <div key={space.id} className="flex items-center justify-between border-b pb-4 last:border-b-0">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-orange-400 to-purple-400 rounded-lg flex items-center justify-center">
                          <BookOpen className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <p className="font-medium">{space.name}</p>
                          <p className="text-sm text-gray-600">
                            {format(space.lastActivity, "MM월 dd일 활동", { locale: ko })}
                          </p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        확인하기
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardStudent;
