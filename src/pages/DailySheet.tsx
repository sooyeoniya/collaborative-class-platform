import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Send, MessageSquare, Users, Eye, EyeOff } from "lucide-react";

interface SheetRow {
  id: string;
  title: string;
  description: string;
  isVisible: boolean;
  responses: Record<string, string>; // studentName -> response
}

interface ChatMessage {
  id: string;
  sender: string;
  message: string;
  timestamp: Date;
  isInstructor: boolean;
}

const DailySheet = () => {
  const { spaceId, sheetDate } = useParams();
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState<'mentor' | 'student'>('student');
  const [userName, setUserName] = useState('박소연');
  const [newMessage, setNewMessage] = useState('');
  
  // Mock data for sheet rows
  const [sheetRows, setSheetRows] = useState<SheetRow[]>([
    {
      id: '1',
      title: '오늘의 체크인',
      description: '오늘 기분을 1~10점으로 표현해주세요',
      isVisible: true,
      responses: {
        '박소연': '8점 - 새로운 내용을 배워서 기대됩니다!',
        '이민준': '7점 - 조금 피곤하지만 열심히 하겠습니다',
        '정하은': '9점 - 오늘 수업이 정말 기대돼요!'
      }
    },
    {
      id: '2',
      title: '어제 과제 소감',
      description: '어제 과제를 하면서 어려웠던 점이나 새로 배운 점을 공유해주세요',
      isVisible: true,
      responses: {
        '박소연': 'React Hook을 처음 써봤는데 정말 신기했어요. useState 사용법을 익힐 수 있었습니다.',
        '이민준': '컴포넌트 구조를 짜는 게 생각보다 어려웠어요. 하지만 재사용성에 대해 많이 생각해볼 수 있었습니다.',
        '정하은': ''
      }
    },
    {
      id: '3',
      title: '오늘의 토론 주제',
      description: 'React와 Vue 중 어떤 것이 더 좋다고 생각하시나요?',
      isVisible: false,
      responses: {
        '박소연': '',
        '이민준': '',
        '정하은': ''
      }
    }
  ]);

  // Mock data for chat messages
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: '김지훈',
      message: '안녕하세요! 오늘 수업을 시작하겠습니다. 모두 준비되셨나요?',
      timestamp: new Date('2024-01-15T09:00:00'),
      isInstructor: true
    },
    {
      id: '2',
      sender: '박소연',
      message: '네! 준비됐습니다~',
      timestamp: new Date('2024-01-15T09:01:00'),
      isInstructor: false
    },
    {
      id: '3',
      sender: '이민준',
      message: '저도 준비 완료입니다!',
      timestamp: new Date('2024-01-15T09:01:30'),
      isInstructor: false
    }
  ]);

  const handleResponseUpdate = (rowId: string, value: string) => {
    setSheetRows(prev => prev.map(row => 
      row.id === rowId 
        ? { ...row, responses: { ...row.responses, [userName]: value } }
        : row
    ));
  };

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const message: ChatMessage = {
        id: Date.now().toString(),
        sender: userName,
        message: newMessage,
        timestamp: new Date(),
        isInstructor: userRole === 'mentor'
      };
      setChatMessages(prev => [...prev, message]);
      setNewMessage('');
    }
  };

  const toggleRowVisibility = (rowId: string) => {
    if (userRole === 'mentor') {
      setSheetRows(prev => prev.map(row => 
        row.id === rowId ? { ...row, isVisible: !row.isVisible } : row
      ));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            뒤로가기
          </Button>
          <div>
            <h1 className="text-2xl font-bold">레벨1 - {sheetDate} 수업</h1>
            <p className="text-gray-600">실시간 협업 시트</p>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <Badge variant="outline" className="flex items-center gap-1">
              <Users className="w-3 h-3" />
              참여자 3명
            </Badge>
            <Badge className={userRole === 'mentor' ? 'gradient-mentor text-white' : 'gradient-student text-white'}>
              {userRole === 'mentor' ? '멘토' : '수강생'}: {userName}
            </Badge>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Sheet Content */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  데일리 시트
                  <Badge variant="secondary">{sheetDate}</Badge>
                </CardTitle>
                <CardDescription>
                  각 주제에 대해 자신의 의견을 작성해주세요
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {sheetRows.map((row) => (
                  <Card key={row.id} className={!row.isVisible ? 'opacity-50' : ''}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{row.title}</CardTitle>
                        {userRole === 'mentor' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleRowVisibility(row.id)}
                            className="flex items-center gap-1"
                          >
                            {row.isVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                            {row.isVisible ? '공개' : '비공개'}
                          </Button>
                        )}
                      </div>
                      <CardDescription>{row.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {row.isVisible ? (
                        <div className="space-y-4">
                          {/* Current user's response */}
                          <div className="p-3 bg-blue-50 rounded-lg">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge className="gradient-student text-white text-xs">{userName}</Badge>
                            </div>
                            <Textarea
                              placeholder="여기에 답변을 작성해주세요..."
                              value={row.responses[userName] || ''}
                              onChange={(e) => handleResponseUpdate(row.id, e.target.value)}
                              className="min-h-[80px]"
                            />
                          </div>
                          
                          {/* Other participants' responses */}
                          <div className="space-y-2">
                            <h4 className="text-sm font-medium text-gray-700">다른 참여자들의 답변</h4>
                            {Object.entries(row.responses)
                              .filter(([name]) => name !== userName)
                              .map(([name, response]) => (
                                <div key={name} className="p-3 bg-gray-50 rounded-lg">
                                  <div className="flex items-center gap-2 mb-2">
                                    <Badge variant="outline" className="text-xs">{name}</Badge>
                                  </div>
                                  <p className="text-sm">{response || '아직 작성하지 않았습니다.'}</p>
                                </div>
                              ))}
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-8 text-gray-500">
                          {userRole === 'mentor' ? 
                            '이 주제는 현재 비공개 상태입니다. 공개하려면 위의 버튼을 클릭하세요.' :
                            '이 주제는 아직 공개되지 않았습니다.'
                          }
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Chat Section */}
          <div className="lg:col-span-1">
            <Card className="h-[600px] flex flex-col">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  실시간 채팅
                </CardTitle>
                <CardDescription>
                  수업 중 자유롭게 소통해보세요
                </CardDescription>
              </CardHeader>
              <Separator />
              
              {/* Chat Messages */}
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {chatMessages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.sender === userName ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[80%] ${msg.sender === userName ? 'order-2' : 'order-1'}`}>
                        <div className="flex items-center gap-2 mb-1">
                          <Badge 
                            className={`text-xs ${msg.isInstructor ? 'gradient-mentor text-white' : 'gradient-student text-white'}`}
                          >
                            {msg.sender}
                          </Badge>
                          <span className="text-xs text-gray-500">
                            {msg.timestamp.toLocaleTimeString('ko-KR', { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </span>
                        </div>
                        <div className={`p-3 rounded-lg ${
                          msg.sender === userName 
                            ? 'bg-blue-500 text-white ml-auto' 
                            : 'bg-gray-100 text-gray-900'
                        }`}>
                          <p className="text-sm">{msg.message}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
              
              <Separator />
              
              {/* Message Input */}
              <div className="p-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="메시지를 입력하세요..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    className="flex-1"
                  />
                  <Button onClick={handleSendMessage} className="px-3">
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DailySheet;
