
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UserCheck, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface LoginFormProps {
  onLogin: (role: 'mentor' | 'student', name: string) => void;
}

const LoginForm = ({ onLogin }: LoginFormProps) => {
  const [nameInput, setNameInput] = useState('');
  const [phoneInput, setPhoneInput] = useState('');
  const [error, setError] = useState('');

  // Mock user data
  const mockUsers = {
    mentor: {
      name: '김지훈',
      phone: '010-1234-5678'
    },
    students: [
      { name: '박소연', phone: '010-2345-6789' },
      { name: '이민준', phone: '010-3456-7890' },
      { name: '정하은', phone: '010-4567-8901' }
    ]
  };

  const handleLogin = (role: 'mentor' | 'student') => {
    setError('');
    
    if (!nameInput && !phoneInput) {
      setError('이름 또는 전화번호를 입력해주세요.');
      return;
    }

    if (role === 'mentor') {
      const isValidMentor = 
        nameInput === mockUsers.mentor.name || 
        phoneInput === mockUsers.mentor.phone;
      
      if (isValidMentor) {
        onLogin('mentor', mockUsers.mentor.name);
      } else {
        setError('멘토 계정 정보가 일치하지 않습니다.');
      }
    } else {
      const validStudent = mockUsers.students.find(student => 
        nameInput === student.name || phoneInput === student.phone
      );
      
      if (validStudent) {
        onLogin('student', validStudent.name);
      } else {
        setError('수강생 계정 정보가 일치하지 않습니다.');
      }
    }
  };

  return (
    <div className="space-y-4">
      <Tabs defaultValue="mentor" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="mentor">멘토</TabsTrigger>
          <TabsTrigger value="student">수강생</TabsTrigger>
        </TabsList>
        
        <TabsContent value="mentor">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">멘토 로그인</CardTitle>
              <CardDescription>
                교육 프로그램을 운영하는 멘토용 계정
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="mentor-name">이름</Label>
                <Input
                  id="mentor-name"
                  placeholder="김지훈"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="mentor-phone">전화번호</Label>
                <Input
                  id="mentor-phone"
                  placeholder="010-1234-5678"
                  value={phoneInput}
                  onChange={(e) => setPhoneInput(e.target.value)}
                />
              </div>
              {error && (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <Button 
                onClick={() => handleLogin('mentor')}
                className="w-full gradient-mentor text-white hover:opacity-90"
              >
                <UserCheck className="w-4 h-4 mr-2" />
                멘토로 로그인
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="student">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">수강생 로그인</CardTitle>
              <CardDescription>
                교육 프로그램에 참여하는 수강생용 계정
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="student-name">이름</Label>
                <Input
                  id="student-name"
                  placeholder="박소연, 이민준, 정하은 중 하나"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="student-phone">전화번호</Label>
                <Input
                  id="student-phone"
                  placeholder="010-XXXX-XXXX"
                  value={phoneInput}
                  onChange={(e) => setPhoneInput(e.target.value)}
                />
              </div>
              {error && (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <Button 
                onClick={() => handleLogin('student')}
                className="w-full gradient-student text-white hover:opacity-90"
              >
                <UserCheck className="w-4 h-4 mr-2" />
                수강생으로 로그인
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LoginForm;
