
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Calendar, Users, MessageSquare, Plus, LogOut, BookOpen, UserPlus } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface DashboardStudentProps {
  userName: string;
  onLogout: () => void;
}

const DashboardStudent = ({ userName, onLogout }: DashboardStudentProps) => {
  const navigate = useNavigate();
  const [inviteCode, setInviteCode] = useState('');
  const [previewSpace, setPreviewSpace] = useState<any>(null);
  const [isJoinDialogOpen, setIsJoinDialogOpen] = useState(false);

  // Mock data
  const mockSpaces = [
    {
      id: 'space1',
      name: '레벨 1 React 마스터 과정',
      category: 'React',
      instructor: '김지훈',
      studentCount: 3,
      period: '2024년 1월 15일 ~ 2024년 3월 30일',
      recentSheets: [
        { date: '2024-01-15' },
        { date: '2024-01-12' },
        { date: '2024-01-09' }
      ]
    },
    {
      id: 'space2',
      name: '레벨 2 Vue.js 정복',
      category: 'Vue.js',
      instructor: '김지훈',
      studentCount: 5,
      period: '2024년 4월 1일 ~ 2024년 6월 30일',
      recentSheets: [
        { date: '2024-04-01' },
        { date: '2024-03-29' },
        { date: '2024-03-26' }
      ]
    }
  ];

  const handlePreviewSpace = () => {
    // Mock preview based on invite code
    const mockPreview = {
      'REACT2024': {
        name: '레벨 1 React 마스터 과정',
        category: 'React',
        instructor: '김지훈',
        type: '수업',
        studentCount: 3
      },
      'VUE2024': {
        name: '레벨 2 Vue.js 정복',
        category: 'Vue.js',
        instructor: '김지훈',
        type: '수업',
        studentCount: 5
      }
    };
    
    const preview = mockPreview[inviteCode as keyof typeof mockPreview];
    setPreviewSpace(preview || null);
  };

  const handleJoinSpace = () => {
    if (previewSpace) {
      console.log(`${previewSpace.name}에 참여합니다!`);
      setIsJoinDialogOpen(false);
      setInviteCode('');
      setPreviewSpace(null);
    }
  };

  const navigateToSpaceDetail = (spaceId: string) => {
    navigate(`/space/${spaceId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 py-4">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">EduSheet</h1>
            </div>
            <Button onClick={onLogout} variant="outline" className="flex items-center gap-2 border-gray-300 text-gray-700 hover:bg-gray-50">
              <LogOut className="w-4 h-4" />
              로그아웃
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">수강생 대시보드</h1>
            <p className="text-gray-600 mt-2">안녕하세요, {userName}님! 오늘도 열심히 학습해보세요.</p>
          </div>
        </div>

        {/* Stats Cards */}
        <section className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card className="bg-white border-gray-200 hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900">총 학습 시간</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-gray-900">45 시간</div>
              <p className="text-sm text-gray-500 mt-2">이번 달 학습 시간: 12 시간</p>
            </CardContent>
          </Card>

          <Card className="bg-white border-gray-200 hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900">완료한 시트</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-gray-900">23 개</div>
              <p className="text-sm text-gray-500 mt-2">이번 달 완료: 8 개</p>
            </CardContent>
          </Card>

          <Card className="bg-white border-gray-200 hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900">참여 중인 수업</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-gray-900">2 개</div>
              <p className="text-sm text-gray-500 mt-2">최근 참여 수업: React 마스터 과정</p>
            </CardContent>
          </Card>
        </section>

        {/* Join Space Dialog */}
        <Dialog open={isJoinDialogOpen} onOpenChange={setIsJoinDialogOpen}>
          <DialogTrigger asChild>
            <Button className="mb-8 bg-black text-white hover:bg-gray-800 flex items-center gap-2">
              <UserPlus className="w-4 h-4" />
              수업 참여하기
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>수업 참여하기</DialogTitle>
              <DialogDescription>
                수업 공간의 초대 코드를 입력해주세요.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="invite-code" className="text-right">
                  초대 코드
                </Label>
                <Input
                  id="invite-code"
                  value={inviteCode}
                  onChange={(e) => setInviteCode(e.target.value)}
                  className="col-span-3"
                  placeholder="REACT2024"
                />
              </div>
              <Button onClick={handlePreviewSpace} variant="outline" className="w-full border-gray-300 text-gray-700 hover:bg-gray-50">
                공간 정보 미리보기
              </Button>
              
              {previewSpace && (
                <Card className="bg-gray-50 border-gray-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg text-gray-900">{previewSpace.name}</CardTitle>
                    <CardDescription className="text-gray-600">멘토: {previewSpace.instructor}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Badge className="bg-black text-white">{previewSpace.category}</Badge>
                        <Badge variant="outline" className="border-gray-300 text-gray-700">{previewSpace.type}</Badge>
                      </div>
                      <p className="text-sm text-gray-600">현재 {previewSpace.studentCount}명이 참여 중입니다.</p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
            <Button 
              onClick={handleJoinSpace} 
              disabled={!previewSpace}
              className="w-full bg-black text-white hover:bg-gray-800 disabled:bg-gray-300"
            >
              참여하기
            </Button>
          </DialogContent>
        </Dialog>

        {/* My Spaces */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">참여 중인 수업</h2>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockSpaces.map((space) => (
              <Card key={space.id} className="bg-white border-gray-200 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <Badge className="bg-black text-white">{space.category}</Badge>
                    <Badge variant="outline" className="border-gray-300 text-gray-700">{space.studentCount}명 참여</Badge>
                  </div>
                  <CardTitle className="text-lg text-gray-900">{space.name}</CardTitle>
                  <CardDescription className="text-gray-600">멘토: {space.instructor}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4" />
                      {space.period}
                    </div>
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-gray-900">최근 데일리 시트</h4>
                      {space.recentSheets.map((sheet) => (
                        <div key={sheet.date} className="flex items-center justify-between p-2 bg-gray-50 rounded border">
                          <span className="text-sm text-gray-700">{sheet.date}</span>
                          <Button 
                            size="sm" 
                            variant="ghost"
                            onClick={() => navigate(`/space/${space.id}/sheet/${sheet.date}`)}
                            className="text-xs text-gray-600 hover:text-gray-900"
                          >
                            참여하기
                          </Button>
                        </div>
                      ))}
                    </div>
                    <Button 
                      className="w-full bg-black text-white hover:bg-gray-800"
                      onClick={() => navigateToSpaceDetail(space.id)}
                    >
                      수업 참여하기
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Recent Activities */}
        <section>
          <h2 className="text-2xl font-bold mb-6 text-gray-900">최근 활동</h2>
          <Card className="bg-white border-gray-200">
            <CardHeader>
              <CardTitle className="text-gray-900">오늘의 활동 요약</CardTitle>
              <CardDescription className="text-gray-600">최근 학습 활동을 한눈에 확인하세요.</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-5 space-y-1 text-gray-700">
                <li>React 마스터 과정 - 데일리 시트 "2024-01-15" 완료</li>
                <li>Vue.js 정복 - "컴포넌트 통신" 챕터 학습</li>
                <li>커뮤니티 포럼에 "React Hook 질문" 게시</li>
              </ul>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
};

export default DashboardStudent;
