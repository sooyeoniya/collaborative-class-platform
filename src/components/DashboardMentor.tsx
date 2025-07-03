
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar, Users, MessageSquare, Plus, Settings, LogOut, BookOpen, Copy, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface DashboardMentorProps {
  userName: string;
  onLogout: () => void;
}

const DashboardMentor = ({ userName, onLogout }: DashboardMentorProps) => {
  const navigate = useNavigate();
  const [newSpaceName, setNewSpaceName] = useState('');
  const [newSpaceCategory, setNewSpaceCategory] = useState('');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [mockSpaces, setMockSpaces] = useState([
    {
      id: 'space1',
      name: '레벨 1 React 마스터 과정',
      category: 'React',
      instructor: '김지훈',
      studentCount: 3,
      period: '2024년 1월 15일 - 2024년 3월 30일',
      inviteCode: 'REACT2024',
      recentSheets: [
        { date: '2024-01-15' },
        { date: '2024-01-14' }
      ]
    },
    {
      id: 'space2',
      name: '레벨 2 Vue.js 정복',
      category: 'Vue.js',
      instructor: '김지훈',
      studentCount: 5,
      period: '2024년 4월 1일 - 2024년 6월 30일',
      inviteCode: 'VUE2024',
      recentSheets: [
        { date: '2024-04-01' },
        { date: '2024-03-31' }
      ]
    }
  ]);

  const [recentActivities, setRecentActivities] = useState([
    {
      id: 'activity1',
      spaceName: '레벨 1 React 마스터 과정',
      date: '2024-01-15',
      activity: '김지훈 멘토가 데일리 시트를 생성했습니다.'
    },
    {
      id: 'activity2',
      spaceName: '레벨 2 Vue.js 정복',
      date: '2024-04-01',
      activity: '김지훈 멘토가 데일리 시트를 생성했습니다.'
    }
  ]);

  const navigateToSpaceDetail = (spaceId: string) => {
    navigate(`/space/${spaceId}`);
  };

  const copyInviteCode = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(null), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const createNewSpace = () => {
    if (newSpaceName && newSpaceCategory) {
      const newSpace = {
        id: `space${mockSpaces.length + 1}`,
        name: newSpaceName,
        category: newSpaceCategory,
        instructor: '김지훈',
        studentCount: 0,
        period: '2024년 ' + (new Date().getMonth() + 1) + '월 - 미정',
        inviteCode: newSpaceName.substring(0, 4).toUpperCase() + '2024',
        recentSheets: []
      };
      setMockSpaces([...mockSpaces, newSpace]);
      setNewSpaceName('');
      setNewSpaceCategory('');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-gray-900">EduSheet</h1>
          </div>
          <div className="flex items-center gap-4">
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
            <h1 className="text-3xl font-bold text-gray-900">멘토 대시보드</h1>
            <p className="text-gray-600 mt-2">안녕하세요, {userName}님! 오늘도 멋진 수업을 진행해보세요.</p>
          </div>
        </div>

        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card className="bg-white border-gray-200 hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900">오늘의 할 일</CardTitle>
              <CardDescription className="text-gray-600">중요도에 따라 먼저 처리하세요</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">3개</div>
            </CardContent>
          </Card>

          <Card className="bg-white border-gray-200 hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900">이번 주 참여율</CardTitle>
              <CardDescription className="text-gray-600">학생들의 참여도를 확인하세요</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">85%</div>
            </CardContent>
          </Card>

          <Card className="bg-white border-gray-200 hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900">다가오는 수업</CardTitle>
              <CardDescription className="text-gray-600">다음 수업을 준비하세요</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">2개</div>
            </CardContent>
          </Card>
        </section>

        {/* My Classes */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">내 수업 공간</h2>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="bg-black text-white hover:bg-gray-800">
                  <Plus className="w-4 h-4 mr-2" />
                  새 수업 공간 만들기
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>새 수업 공간 만들기</DialogTitle>
                  <DialogDescription>
                    새로운 수업 공간을 생성합니다.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="space-name" className="text-right">
                      수업명
                    </Label>
                    <Input
                      id="space-name"
                      value={newSpaceName}
                      onChange={(e) => setNewSpaceName(e.target.value)}
                      className="col-span-3"
                      placeholder="React 마스터 과정"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="space-category" className="text-right">
                      카테고리
                    </Label>
                    <Input
                      id="space-category"
                      value={newSpaceCategory}
                      onChange={(e) => setNewSpaceCategory(e.target.value)}
                      className="col-span-3"
                      placeholder="React"
                    />
                  </div>
                </div>
                <Button onClick={createNewSpace} className="w-full bg-black text-white hover:bg-gray-800">
                  공간 생성하기
                </Button>
              </DialogContent>
            </Dialog>
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
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <span>초대 코드: {space.inviteCode}</span>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => copyInviteCode(space.inviteCode)}
                          className="h-6 w-6 p-0"
                        >
                          {copiedCode === space.inviteCode ? (
                            <Check className="w-3 h-3 text-green-600" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </Button>
                      </div>
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
                            열기
                          </Button>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-2 pt-2">
                      <Button 
                        size="sm" 
                        className="flex-1 bg-black text-white hover:bg-gray-800"
                        onClick={() => navigateToSpaceDetail(space.id)}
                      >
                        수업 관리
                      </Button>
                      <Button size="sm" variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50">
                        <Settings className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Recent Activities */}
        <section>
          <h2 className="text-2xl font-bold mb-6 text-gray-900">최근 활동</h2>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <Card key={activity.id} className="bg-white border-gray-200">
                <CardContent className="p-3">
                  <p className="text-sm text-gray-700">
                    <span className="font-medium text-gray-900">{activity.spaceName}</span> - {activity.activity} ({activity.date})
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default DashboardMentor;
