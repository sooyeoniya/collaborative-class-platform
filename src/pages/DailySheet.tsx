import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  ArrowLeft,
  Send,
  MessageSquare,
  Users,
  Eye,
  EyeOff,
  Save,
  ChevronDown,
  ChevronUp,
  Plus,
  Edit,
  Trash2,
} from "lucide-react";

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

  // 실제 로그인된 사용자 정보 (localStorage에서 가져옴)
  const getCurrentUser = () => {
    const userInfo = localStorage.getItem("currentUser");
    if (userInfo) {
      return JSON.parse(userInfo);
    }
    // 로그인 정보가 없는 경우 로그인 페이지로 리디렉트하거나 기본값 설정
    console.warn("로그인 정보가 없습니다. 로그인 페이지로 이동해야 합니다.");
    return { name: "박소연", role: "student" }; // 임시 기본값
  };

  const currentUser = getCurrentUser();
  const [userRole] = useState<"mentor" | "student">(currentUser.role);
  const [userName] = useState(currentUser.name);

  // 개발/테스트용: 콘솔에서 사용자 전환 가능
  // 예: switchUser('mentor', '김지훈') 또는 switchUser('student', '박소연')
  (
    window as {
      switchUser?: (role: "mentor" | "student", name: string) => void;
    }
  ).switchUser = (role: "mentor" | "student", name: string) => {
    localStorage.setItem("currentUser", JSON.stringify({ role, name }));
    window.location.reload();
  };

  const [newMessage, setNewMessage] = useState("");
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [unsavedChanges, setUnsavedChanges] = useState<Set<string>>(new Set());
  const [editingRow, setEditingRow] = useState<string | null>(null);
  const [newRowTitle, setNewRowTitle] = useState("");
  const [newRowDescription, setNewRowDescription] = useState("");
  const [editRowTitle, setEditRowTitle] = useState("");
  const [editRowDescription, setEditRowDescription] = useState("");

  // Mock data for sheet rows
  const [sheetRows, setSheetRows] = useState<SheetRow[]>([
    {
      id: "1",
      title: "오늘의 체크인",
      description: "오늘 기분을 1~10점으로 표현해주세요",
      isVisible: true,
      responses: {
        박소연: "8점 - 새로운 내용을 배워서 기대됩니다!",
        이민준: "7점 - 조금 피곤하지만 열심히 하겠습니다",
        정하은: "9점 - 오늘 수업이 정말 기대돼요!",
      },
    },
    {
      id: "2",
      title: "어제 과제 소감",
      description:
        "어제 과제를 하면서 어려웠던 점이나 새로 배운 점을 공유해주세요",
      isVisible: true,
      responses: {
        박소연:
          "React Hook을 처음 써봤는데 정말 신기했어요. useState 사용법을 익힐 수 있었습니다.",
        이민준:
          "컴포넌트 구조를 짜는 게 생각보다 어려웠어요. 하지만 재사용성에 대해 많이 생각해볼 수 있었습니다.",
        정하은: "",
      },
    },
    {
      id: "3",
      title: "오늘의 토론 주제",
      description: "React와 Vue 중 어떤 것이 더 좋다고 생각하시나요?",
      isVisible: false,
      responses: {
        박소연: "",
        이민준: "",
        정하은: "",
      },
    },
  ]);

  // Mock data for chat messages
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      sender: "김지훈",
      message: "안녕하세요! 오늘 수업을 시작하겠습니다. 모두 준비되셨나요?",
      timestamp: new Date("2024-01-15T09:00:00"),
      isInstructor: true,
    },
    {
      id: "2",
      sender: "박소연",
      message: "네! 준비됐습니다~",
      timestamp: new Date("2024-01-15T09:01:00"),
      isInstructor: false,
    },
    {
      id: "3",
      sender: "이민준",
      message: "저도 준비 완료입니다!",
      timestamp: new Date("2024-01-15T09:01:30"),
      isInstructor: false,
    },
  ]);

  const handleResponseUpdate = (rowId: string, value: string) => {
    setSheetRows((prev) =>
      prev.map((row) =>
        row.id === rowId
          ? { ...row, responses: { ...row.responses, [userName]: value } }
          : row
      )
    );
    setUnsavedChanges((prev) => new Set(prev).add(rowId));
  };

  const handleSaveResponse = (rowId: string) => {
    // 실제로는 서버에 저장하는 로직
    console.log(`Row ${rowId} 저장됨`);
    setUnsavedChanges((prev) => {
      const newSet = new Set(prev);
      newSet.delete(rowId);
      return newSet;
    });
  };

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const message: ChatMessage = {
        id: Date.now().toString(),
        sender: userName,
        message: newMessage,
        timestamp: new Date(),
        isInstructor: userRole === "mentor",
      };
      setChatMessages((prev) => [...prev, message]);
      setNewMessage("");
    }
  };

  const toggleRowVisibility = (rowId: string) => {
    if (userRole === "mentor") {
      setSheetRows((prev) =>
        prev.map((row) =>
          row.id === rowId ? { ...row, isVisible: !row.isVisible } : row
        )
      );
    }
  };

  const toggleRowExpansion = (rowId: string) => {
    setExpandedRows((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(rowId)) {
        newSet.delete(rowId);
      } else {
        newSet.add(rowId);
      }
      return newSet;
    });
  };

  const handleBackClick = () => {
    navigate(`/space/${spaceId}`);
  };

  const addNewRow = () => {
    if (!newRowTitle.trim()) return;

    const newRow: SheetRow = {
      id: Date.now().toString(),
      title: newRowTitle,
      description: newRowDescription,
      isVisible: true,
      responses: {
        박소연: "",
        이민준: "",
        정하은: "",
      },
    };

    setSheetRows((prev) => [...prev, newRow]);
    setNewRowTitle("");
    setNewRowDescription("");
  };

  const handleEditRow = (row: SheetRow) => {
    setEditingRow(row.id);
    setEditRowTitle(row.title);
    setEditRowDescription(row.description);
  };

  const saveRowEdit = () => {
    if (!editingRow || !editRowTitle.trim()) return;

    setSheetRows((prev) =>
      prev.map((row) =>
        row.id === editingRow
          ? { ...row, title: editRowTitle, description: editRowDescription }
          : row
      )
    );

    setEditingRow(null);
    setEditRowTitle("");
    setEditRowDescription("");
  };

  const deleteRow = (rowId: string) => {
    setSheetRows((prev) => prev.filter((row) => row.id !== rowId));
  };

  // 수강생에게는 공개된 주제만 보여주기
  const visibleRows =
    userRole === "mentor"
      ? sheetRows
      : sheetRows.filter((row) => row.isVisible);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            onClick={handleBackClick}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-4 h-4" />
            뒤로가기
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              레벨1 - {sheetDate} 수업
            </h1>
            <p className="text-gray-600">실시간 협업 시트</p>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <Badge
              variant="outline"
              className="flex items-center gap-1 border-gray-300 text-gray-700"
            >
              <Users className="w-3 h-3" />
              참여자 3명
            </Badge>
            <Badge
              className={
                userRole === "mentor"
                  ? "bg-black text-white"
                  : "bg-gray-800 text-white"
              }
            >
              {userRole === "mentor" ? "멘토" : "수강생"}: {userName}
            </Badge>
          </div>
        </div>

        {/* Responsive Layout */}
        <div className="flex flex-col xl:grid xl:grid-cols-3 gap-6">
          {/* Sheet Content */}
          <div className="xl:col-span-2 order-1">
            <Card className="bg-white border-gray-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-900">
                  데일리 시트
                  <Badge
                    variant="secondary"
                    className="bg-gray-100 text-gray-700"
                  >
                    {sheetDate}
                  </Badge>
                </CardTitle>
                <CardDescription className="text-gray-600">
                  각 주제에 대해 자신의 의견을 작성해주세요
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* 멘토용 주제 추가 버튼 */}
                {userRole === "mentor" && (
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="w-full bg-black text-white hover:bg-gray-800">
                        <Plus className="w-4 h-4 mr-2" />새 주제 추가
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                      <DialogHeader>
                        <DialogTitle>새 주제 추가</DialogTitle>
                        <DialogDescription>
                          데일리 시트에 새로운 주제를 추가합니다.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="new-title" className="text-right">
                            제목
                          </Label>
                          <Input
                            id="new-title"
                            value={newRowTitle}
                            onChange={(e) => setNewRowTitle(e.target.value)}
                            className="col-span-3"
                            placeholder="주제 제목을 입력하세요"
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label
                            htmlFor="new-description"
                            className="text-right"
                          >
                            설명
                          </Label>
                          <Textarea
                            id="new-description"
                            value={newRowDescription}
                            onChange={(e) =>
                              setNewRowDescription(e.target.value)
                            }
                            className="col-span-3"
                            placeholder="주제에 대한 설명을 입력하세요"
                          />
                        </div>
                      </div>
                      <Button
                        onClick={addNewRow}
                        className="w-full bg-black text-white hover:bg-gray-800"
                      >
                        주제 추가하기
                      </Button>
                    </DialogContent>
                  </Dialog>
                )}

                {visibleRows.map((row) => (
                  <Card
                    key={row.id}
                    className={`border-gray-200 ${
                      userRole === "mentor" && !row.isVisible
                        ? "opacity-50"
                        : ""
                    }`}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg text-gray-900">
                          {row.title}
                        </CardTitle>
                        {userRole === "mentor" && (
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleRowVisibility(row.id)}
                              className="flex items-center gap-1 text-gray-600 hover:text-gray-900"
                            >
                              {row.isVisible ? (
                                <Eye className="w-4 h-4" />
                              ) : (
                                <EyeOff className="w-4 h-4" />
                              )}
                            </Button>
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleEditRow(row)}
                                  className="text-gray-600 hover:text-gray-900"
                                >
                                  <Edit className="w-4 h-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-md">
                                <DialogHeader>
                                  <DialogTitle>주제 수정</DialogTitle>
                                  <DialogDescription>
                                    주제의 제목과 설명을 수정합니다.
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                  <div className="grid grid-cols-4 items-center gap-4">
                                    <Label
                                      htmlFor="edit-title"
                                      className="text-right"
                                    >
                                      제목
                                    </Label>
                                    <Input
                                      id="edit-title"
                                      value={editRowTitle}
                                      onChange={(e) =>
                                        setEditRowTitle(e.target.value)
                                      }
                                      className="col-span-3"
                                    />
                                  </div>
                                  <div className="grid grid-cols-4 items-center gap-4">
                                    <Label
                                      htmlFor="edit-description"
                                      className="text-right"
                                    >
                                      설명
                                    </Label>
                                    <Textarea
                                      id="edit-description"
                                      value={editRowDescription}
                                      onChange={(e) =>
                                        setEditRowDescription(e.target.value)
                                      }
                                      className="col-span-3"
                                    />
                                  </div>
                                </div>
                                <Button
                                  onClick={saveRowEdit}
                                  className="w-full bg-black text-white hover:bg-gray-800"
                                >
                                  <Edit className="w-4 h-4 mr-2" />
                                  수정하기
                                </Button>
                              </DialogContent>
                            </Dialog>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-red-600 hover:text-red-700"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>주제 삭제</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    정말로 이 주제를 삭제하시겠습니까? 모든
                                    참여자의 답변이 함께 삭제되며, 이 작업은
                                    되돌릴 수 없습니다.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>취소</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => deleteRow(row.id)}
                                    className="bg-red-600 hover:bg-red-700"
                                  >
                                    삭제
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        )}
                      </div>
                      <CardDescription className="text-gray-600">
                        {row.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {/* 수강생인 경우 공개된 주제만 표시되므로 항상 내용을 보여줌 */}
                      {/* 멘토인 경우 비공개 주제에 대해서는 특별한 표시 */}
                      {userRole === "student" || row.isVisible ? (
                        <div className="space-y-4">
                          {/* Current user's response */}
                          <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                            <div className="flex items-center justify-between mb-2">
                              <Badge className="bg-gray-800 text-white text-xs">
                                {userName}
                              </Badge>
                              {unsavedChanges.has(row.id) && (
                                <Button
                                  size="sm"
                                  onClick={() => handleSaveResponse(row.id)}
                                  className="h-6 px-2 text-xs bg-black text-white hover:bg-gray-800"
                                >
                                  <Save className="w-3 h-3 mr-1" />
                                  저장
                                </Button>
                              )}
                            </div>
                            <Textarea
                              placeholder="여기에 답변을 작성해주세요..."
                              value={row.responses[userName] || ""}
                              onChange={(e) =>
                                handleResponseUpdate(row.id, e.target.value)
                              }
                              className="min-h-[80px] border-gray-300"
                              disabled={
                                userRole === "student" && !row.isVisible
                              }
                            />
                          </div>

                          {/* Other participants' responses */}
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <h4 className="text-sm font-medium text-gray-900">
                                다른 참여자들의 답변
                              </h4>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => toggleRowExpansion(row.id)}
                                className="flex items-center gap-1 text-xs text-gray-600 hover:text-gray-900"
                              >
                                {expandedRows.has(row.id) ? (
                                  <>
                                    접기 <ChevronUp className="w-3 h-3" />
                                  </>
                                ) : (
                                  <>
                                    자세히 보기{" "}
                                    <ChevronDown className="w-3 h-3" />
                                  </>
                                )}
                              </Button>
                            </div>

                            {expandedRows.has(row.id) ? (
                              <ScrollArea className="max-h-60">
                                <div className="space-y-2">
                                  {Object.entries(row.responses)
                                    .filter(([name]) => name !== userName)
                                    .map(([name, response]) => (
                                      <div
                                        key={name}
                                        className="p-3 bg-white rounded-lg border border-gray-200"
                                      >
                                        <div className="flex items-center gap-2 mb-2">
                                          <Badge
                                            variant="outline"
                                            className="text-xs border-gray-300 text-gray-700"
                                          >
                                            {name}
                                          </Badge>
                                        </div>
                                        <p className="text-sm text-gray-700">
                                          {response ||
                                            "아직 작성하지 않았습니다."}
                                        </p>
                                      </div>
                                    ))}
                                </div>
                              </ScrollArea>
                            ) : (
                              <div className="space-y-2">
                                {Object.entries(row.responses)
                                  .filter(([name]) => name !== userName)
                                  .slice(0, 2)
                                  .map(([name, response]) => (
                                    <div
                                      key={name}
                                      className="p-3 bg-white rounded-lg border border-gray-200"
                                    >
                                      <div className="flex items-center gap-2 mb-2">
                                        <Badge
                                          variant="outline"
                                          className="text-xs border-gray-300 text-gray-700"
                                        >
                                          {name}
                                        </Badge>
                                      </div>
                                      <p className="text-sm text-gray-700 line-clamp-2">
                                        {response ||
                                          "아직 작성하지 않았습니다."}
                                      </p>
                                    </div>
                                  ))}
                              </div>
                            )}
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-8 text-gray-500">
                          <div className="flex items-center justify-center gap-2 mb-2">
                            <EyeOff className="w-5 h-5" />
                            <span className="font-medium">비공개 주제</span>
                          </div>
                          <p className="text-sm">
                            이 주제는 현재 수강생들에게 공개되지 않았습니다.
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            공개하려면 위의 눈 모양 아이콘을 클릭하세요.
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Chat Section - Responsive: right side on large screens, bottom on smaller screens */}
          <div className="xl:col-span-1 order-2">
            <Card className="h-[600px] flex flex-col bg-white border-gray-200">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-gray-900">
                  <MessageSquare className="w-5 h-5" />
                  실시간 채팅
                </CardTitle>
                <CardDescription className="text-gray-600">
                  수업 중 자유롭게 소통해보세요
                </CardDescription>
              </CardHeader>
              <Separator className="bg-gray-200" />

              {/* Chat Messages */}
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {chatMessages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${
                        msg.sender === userName
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[80%] ${
                          msg.sender === userName ? "order-2" : "order-1"
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <Badge
                            className={`text-xs ${
                              msg.isInstructor
                                ? "bg-black text-white"
                                : "bg-gray-800 text-white"
                            }`}
                          >
                            {msg.sender}
                          </Badge>
                          <span className="text-xs text-gray-500">
                            {msg.timestamp.toLocaleTimeString("ko-KR", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                        <div
                          className={`p-3 rounded-lg ${
                            msg.sender === userName
                              ? "bg-black text-white ml-auto"
                              : "bg-gray-100 text-gray-900"
                          }`}
                        >
                          <p className="text-sm">{msg.message}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              <Separator className="bg-gray-200" />

              {/* Message Input */}
              <div className="p-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="메시지를 입력하세요..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                    className="flex-1 border-gray-300"
                  />
                  <Button
                    onClick={handleSendMessage}
                    className="px-3 bg-black text-white hover:bg-gray-800"
                  >
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
