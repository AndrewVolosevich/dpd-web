"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FileText, Download, Calendar, Clock } from "lucide-react"
import { format } from "date-fns"
import { ru } from "date-fns/locale"

interface ViewAdaptationPlanModalProps {
  isOpen: boolean
  onClose: () => void
  employee: any
  plan: any
}

export function ViewAdaptationPlanModal({ isOpen, onClose, employee, plan }: ViewAdaptationPlanModalProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "IN_PROGRESS":
        return <Badge className="bg-blue-500">В процессе</Badge>
      case "COMPLETED":
        return <Badge className="bg-green-500">Завершен</Badge>
      case "NOT_STARTED":
        return <Badge variant="outline">Не начат</Badge>
      default:
        return null
    }
  }

  const handleDownload = () => {
    // In a real implementation, you would download the file from your server
    // window.open(plan.fileUrl, '_blank')

    // For demo purposes, we'll just show an alert
    alert("В реальном приложении здесь будет скачивание файла")
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>План адаптации</DialogTitle>
        </DialogHeader>

        <div className="py-4 space-y-4">
          <div className="space-y-2">
            <div className="text-sm text-muted-foreground">Сотрудник</div>
            <div className="p-3 bg-muted rounded-md">
              <div className="font-medium">
                {employee?.surname} {employee?.name} {employee?.patronymic}
              </div>
              <div className="text-sm text-muted-foreground">{employee?.position}</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-muted-foreground mb-1">Статус</div>
              <div>{getStatusBadge(plan.status)}</div>
            </div>

            <div>
              <div className="text-sm text-muted-foreground mb-1">Дата начала</div>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                {format(new Date(employee.startDate), "dd MMMM yyyy", { locale: ru })}
              </div>
            </div>

            <div>
              <div className="text-sm text-muted-foreground mb-1">Дата окончания</div>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                {format(new Date(plan.endDate), "dd MMMM yyyy", { locale: ru })}
              </div>
            </div>

            <div>
              <div className="text-sm text-muted-foreground mb-1">Дата загрузки</div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                {format(new Date(plan.uploadedAt), "dd MMMM yyyy", { locale: ru })}
              </div>
            </div>
          </div>

          <div>
            <div className="text-sm text-muted-foreground mb-1">Файл плана адаптации</div>
            <div className="flex items-center justify-between p-3 border rounded-md">
              <div className="flex items-center">
                <FileText className="h-5 w-5 mr-2 text-muted-foreground" />
                <span className="text-sm truncate max-w-[300px]">{plan.fileName}</span>
              </div>
              <Button variant="outline" size="sm" onClick={handleDownload}>
                <Download className="h-4 w-4 mr-2" />
                Скачать
              </Button>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button onClick={onClose}>Закрыть</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
