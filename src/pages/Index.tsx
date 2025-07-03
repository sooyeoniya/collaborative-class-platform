
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, Users, MessageSquare, Calendar, GraduationCap, UserCheck } from "lucide-react";
import LoginForm from "@/components/LoginForm";
import DashboardMentor from "@/components/DashboardMentor";
import DashboardStudent from "@/components/DashboardStudent";

const Index = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<'mentor' | 'student' | null>(null);
  const [userName, setUserName] = useState('');

  const handleLogin = (role: 'mentor' | 'student', name: string) => {
    setIsLoggedIn(true);
    setUserRole(role);
    setUserName(name);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserRole(null);
    setUserName('');
  };

  if (isLoggedIn && userRole) {
    return userRole === 'mentor' ? 
      <DashboardMentor userName={userName} onLogout={handleLogout} /> : 
      <DashboardStudent userName={userName} onLogout={handleLogout} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="text-center mb-16">
          <div className="inline-flex items-center gap-2 mb-6">
            <div className="w-12 h-12 gradient-education rounded-xl flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              EduSheet
            </h1>
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            실시간 협업 기반 수업 시트 & 커뮤니케이션 플랫폼
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            스프레드시트의 자유도와 슬랙의 소통 구조를 하나의 공간에서 해결하는 혁신적인 교육 플랫폼
          </p>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button size="lg" className="gradient-education text-white hover:opacity-90 transition-opacity">
                <UserCheck className="w-5 h-5 mr-2" />
                플랫폼 시작하기
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>로그인</DialogTitle>
                <DialogDescription>
                  테스트 계정으로 플랫폼을 체험해보세요
                </DialogDescription>
              </DialogHeader>
              <LoginForm onLogin={handleLogin} />
            </DialogContent>
          </Dialog>
        </header>

        {/* Features */}
        <section className="mb-16">
          <h3 className="text-2xl font-bold text-center mb-12">주요 기능</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="text-center">
                <div className="w-12 h-12 gradient-mentor rounded-lg mx-auto mb-2 flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-lg">수업 공간 관리</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 text-center">
                  체계적인 수업 공간 생성과 데일리 시트 관리
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="text-center">
                <div className="w-12 h-12 gradient-student rounded-lg mx-auto mb-2 flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-lg">실시간 협업</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 text-center">
                  실시간으로 함께 작성하고 수정하는 협업 시트
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="text-center">
                <div className="w-12 h-12 gradient-education rounded-lg mx-auto mb-2 flex items-center justify-center">
                  <MessageSquare className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-lg">통합 채팅</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 text-center">
                  시트와 함께 사용하는 실시간 채팅 시스템
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg mx-auto mb-2 flex items-center justify-center">
                  <GraduationCap className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-lg">역할별 인터페이스</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 text-center">
                  멘토와 수강생을 위한 맞춤형 사용자 경험
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Test Accounts */}
        <section className="mb-16">
          <Card className="max-w-4xl mx-auto">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">테스트 계정 안내</CardTitle>
              <CardDescription>
                아래 계정으로 로그인하여 플랫폼을 체험해보세요
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="mentor" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="mentor">멘토 계정</TabsTrigger>
                  <TabsTrigger value="student">수강생 계정</TabsTrigger>
                </TabsList>
                <TabsContent value="mentor" className="space-y-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <Badge className="mb-2 gradient-mentor text-white">멘토</Badge>
                    <div className="space-y-2">
                      <p><strong>이름:</strong> 김지훈</p>
                      <p><strong>전화번호:</strong> 010-1234-5678</p>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="student" className="space-y-4">
                  <div className="grid gap-4">
                    <div className="p-4 bg-orange-50 rounded-lg">
                      <Badge className="mb-2 gradient-student text-white">수강생</Badge>
                      <div className="space-y-2">
                        <p><strong>이름:</strong> 박소연</p>
                        <p><strong>전화번호:</strong> 010-2345-6789</p>
                      </div>
                    </div>
                    <div className="p-4 bg-orange-50 rounded-lg">
                      <div className="space-y-2">
                        <p><strong>이름:</strong> 이민준</p>
                        <p><strong>전화번호:</strong> 010-3456-7890</p>
                      </div>
                    </div>
                    <div className="p-4 bg-orange-50 rounded-lg">
                      <div className="space-y-2">
                        <p><strong>이름:</strong> 정하은</p>
                        <p><strong>전화번호:</strong> 010-4567-8901</p>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </section>

        {/* Footer */}
        <footer className="text-center text-gray-500">
          <p className="mb-2">EduSheet - 실시간 협업 교육 플랫폼</p>
          <p className="text-sm">프로토타입 버전 - Mock Data 기반</p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
