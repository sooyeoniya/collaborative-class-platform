
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Plus, Calendar, Users, Copy, Check } from "lucide-react";

const SpaceDetail = () => {
  const { spaceId } = useParams();
  const navigate = useNavigate();
  const [newSheetDate, setNewSheetDate] = useState('');
  const [newSheetTitle, setNewSheetTitle] = useState('');
  const [copiedCode, setCopiedCode] = useState(false);

  // Mock data - 실제로는 spaceId로 데이터를 가져와야 함
  const spaceData = {
    id: spaceId,
    name: '레벨 1 React 마스터 과정',
    category: 'React',
    instructor: '김지훈',
    studentCount: 3,
    period: '2024년 1월 15일 - 2024년 3월 30일',
    inviteCode: 'REACT2024'
  };

  const [dailySheets, setDailySheets] = useState([
    {
      id: 'sheet1',
      date: '2024-01-15',
      title: '첫 번째 수업 - React 기초',
      participantCount: 3,
      status: 'active'
    },
    {
      id: 'sheet2', 
      date: '2024-01-14',
      title: '사전 체크인',
      participantCount: 2,
      status: 'completed'
    },
    {
      id: 'sheet3',
      date: '2024-01-12',
      title: 'OT 및 자기소개',
      participantCount: 3,
      status: 'completed'
    }
  ]);

  const copyInviteCode = async () => {
    try {
      await navigator.clipboard.writeText(spaceData.inviteCode);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const createNewSheet = () => {
    if (newSheetDate && newSheetTitle) {
      const newSheet = {
        id: `sheet${dailySheets.length + 1}`,
        date: newSheetDate,
        title: newSheetTitle,
        participantCount: 0,
        status: 'active' as const
      };
      setDailySheets([newSheet, ...dailySheets]);
      setNewSheetDate('');
      setNewSheetTitle('');
    }
  };

  const navigateToSheet = (sheetDate: string) => {
    navigate(`/space/${spaceId}/sheet/${sheetDate}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-4 h-4" />
            뒤로가기
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900">{spaceData.name}</h1>
            <p className="text-gray-600">데일리 시트 관리</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge className="bg-black text-white">{spaceData.category}</Badge>
            <Badge variant="outline" className="border-gray-300 text-gray-700">
              <Users className="w-3 h-3 mr-1" />
              {spaceData.studentCount}명
            </Badge>
          </div>
        </div>

        {/* Space Info Card */}
        <Card className="mb-6 bg-white border-gray-200">
          <CardHeader>
            <CardTitle className="text-gray-900">수업 공간 정보</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">수업 기간</p>
                <p className="font-medium text-gray-900">{spaceData.period}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">멘토</p>
                <p className="font-medium text-gray-900">{spaceData.instructor}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">초대 코드</p>
                <div className="flex items-center gap-2">
                  <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono text-gray-900">
                    {spaceData.inviteCode}
                  </code>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={copyInviteCode}
                    className="h-8 w-8 p-0"
                  >
                    {copiedCode ? (
                      <Check className="w-4 h-4 text-green-600" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Daily Sheets Section */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">데일리 시트 목록</h2>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-black text-white hover:bg-gray-800">
                <Plus className="w-4 h-4 mr-2" />
                새 데일리 시트 만들기
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>새 데일리 시트 만들기</DialogTitle>
                <DialogDescription>
                  새로운 데일리 시트를 생성합니다.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="sheet-date" className="text-right">
                    날짜
                  </Label>
                  <Input
                    id="sheet-date"
                    type="date"
                    value={newSheetDate}
                    onChange={(e) => setNewSheetDate(e.target.value)}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="sheet-title" className="text-right">
                    제목
                  </Label>
                  <Input
                    id="sheet-title"
                    value={newSheetTitle}
                    onChange={(e) => setNewSheetTitle(e.target.value)}
                    className="col-span-3"
                    placeholder="수업 제목을 입력하세요"
                  />
                </div>
              </div>
              <Button onClick={createNewSheet} className="w-full bg-black text-white hover:bg-gray-800">
                시트 생성하기
              </Button>
            </DialogContent>
          </Dialog>
        </div>

        {/* Daily Sheets Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dailySheets.map((sheet) => (
            <Card key={sheet.id} className="bg-white border-gray-200 hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Badge variant={sheet.status === 'active' ? 'default' : 'secondary'} 
                         className={sheet.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}>
                    {sheet.status === 'active' ? '진행중' : '완료'}
                  </Badge>
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <Users className="w-3 h-3" />
                    {sheet.participantCount}
                  </div>
                </div>
                <CardTitle className="text-lg text-gray-900">{sheet.title}</CardTitle>
                <CardDescription className="flex items-center gap-1 text-gray-600">
                  <Calendar className="w-4 h-4" />
                  {sheet.date}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  onClick={() => navigateToSheet(sheet.date)}
                  className="w-full bg-black text-white hover:bg-gray-800"
                >
                  시트 열기
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SpaceDetail;
