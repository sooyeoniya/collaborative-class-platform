import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Users, MessageSquare, Plus, Settings, LogOut, BookOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface DashboardMentorProps {
  userName: string;
  onLogout: () => void;
}

const DashboardMentor = ({ userName, onLogout }: DashboardMentorProps) => {
  const navigate = useNavigate();
  const [mockSpaces, setMockSpaces] = useState([
    {
      id: 'space1',
      name: '레벨 1 React 마스터 과정',
      category: 'React',
      instructor: '김지훈',
      studentCount: 3,
      period: '2024년 1월 15일 - 2024년 3월 30일',
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

  const navigateToSheet = (spaceId: string, date: string) => {
    navigate(`/space/${spaceId}/sheet/${date}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 gradient-education rounded-xl flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold">EduSheet</h1>
          </div>
          <div className="flex items-center gap-4">
            <Button onClick={onLogout} variant="outline" className="flex items-center gap-2">
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
          <Button onClick={onLogout} variant="outline" className="flex items-center gap-2">
            <LogOut className="w-4 h-4" />
            로그아웃
          </Button>
        </div>

        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card className="bg-blue-50 hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">오늘의 할 일</CardTitle>
              <CardDescription>중요도에 따라 먼저 처리하세요</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-700">3개</div>
            </CardContent>
          </Card>

          <Card className="bg-green-50 hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">이번 주 참여율</CardTitle>
              <CardDescription>학생들의 참여도를 확인하세요</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-700">85%</div>
            </CardContent>
          </Card>

          <Card className="bg-purple-50 hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">다가오는 수업</CardTitle>
              <CardDescription>다음 수업을 준비하세요</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-700">2개</div>
            </CardContent>
          </Card>
        </section>

        {/* My Classes */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">내 수업 공간</h2>
            <Button className="gradient-mentor text-white hover:opacity-90">
              <Plus className="w-4 h-4 mr-2" />
              새 수업 공간 만들기
            </Button>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockSpaces.map((space) => (
              <Card key={space.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <Badge className="gradient-mentor text-white">{space.category}</Badge>
                    <Badge variant="outline">{space.studentCount}명 참여</Badge>
                  </div>
                  <CardTitle className="text-lg">{space.name}</CardTitle>
                  <CardDescription>{space.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4" />
                      {space.period}
                    </div>
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">최근 데일리 시트</h4>
                      {space.recentSheets.map((sheet) => (
                        <div key={sheet.date} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                          <span className="text-sm">{sheet.date}</span>
                          <Button 
                            size="sm" 
                            variant="ghost"
                            onClick={() => navigateToSheet(space.id, sheet.date)}
                            className="text-xs"
                          >
                            열기
                          </Button>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-2 pt-2">
                      <Button 
                        size="sm" 
                        className="flex-1 gradient-mentor text-white hover:opacity-90"
                        onClick={() => navigateToSheet(space.id, '2024-01-15')}
                      >
                        수업 시작
                      </Button>
                      <Button size="sm" variant="outline">
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
          <h2 className="text-2xl font-bold mb-6">최근 활동</h2>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <Card key={activity.id} className="bg-gray-50">
                <CardContent className="p-3">
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">{activity.spaceName}</span> - {activity.activity} ({activity.date})
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
