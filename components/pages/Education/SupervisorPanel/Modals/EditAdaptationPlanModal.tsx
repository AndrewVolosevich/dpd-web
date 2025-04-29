"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { ru } from "date-fns/locale"
import { CalendarIcon, FileText, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface EditAdaptationPlanModalProps {
  isOpen: boolean
  onClose: () => void
  employee: any
  plan: any
}

export function EditAdaptationPlanModal({ isOpen, onClose, employee, plan }: EditAdaptationPlanModalProps) {
  const [file, setFile] = useState<File | null>(null)
  const [endDate, setEndDate] = useState<Date | undefined>(new Date(plan.endDate))
  const [status, setStatus] = useState(plan.status)
  const [isUploading, setIsUploading] = useState(false)
  const { toast } = useToast()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!endDate) {
      toast({
        title: "Ошибка",
        description: "Пожалуйста, выберите дату окончания адаптации",
        variant: "destructive",
      })
      return
    }

    try {
      setIsUploading(true)

      // In a real implementation, you would update the plan on your server
      // const formData = new FormData()
      // if (file) formData.append("file", file)
      // formData.append("planId", plan.id)
      // formData.append("employeeId", employee.id)
      // formData.append("endDate", endDate.toISOString())
      // formData.append("status", status)

      // await api.put("/api/supervisor/adaptation/plan", formData)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "План адаптации обновлен",
        description: `План адаптации для ${employee.surname} ${employee.name} успешно обновлен`,
      })

      onClose()
    } catch (error) {
      console.error("Error updating adaptation plan:", error)
      toast({
        title: "Ошибка обновления",
        description: "Не удалось обновить план адаптации. Пожалуйста, попробуйте еще раз.",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Редактировать план адаптации</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Сотрудник</Label>
            <div className="p-2 bg-muted rounded-md">
              {employee?.surname} {employee?.name} {employee?.patronymic}
              <div className="text-sm text-muted-foreground">{employee?.position}</div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Статус адаптации</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Выберите статус" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="NOT_STARTED">Не начат</SelectItem>
                <SelectItem value="IN_PROGRESS">В процессе</SelectItem>
                <SelectItem value="COMPLETED">Завершен</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="endDate">Дата окончания адаптации</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn("w-full justify-start text-left font-normal", !endDate && "text-muted-foreground")}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {endDate ? format(endDate, "dd MMMM yyyy", { locale: ru }) : <span>Выберите дату</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar mode="single" selected={endDate} onSelect={setEndDate} initialFocus locale={ru} />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label htmlFor="file">Файл плана адаптации</Label>
            {!file ? (
              <div className="border rounded-md p-3 flex items-center justify-between">
                <div className="flex items-center">
                  <FileText className="h-5 w-5 mr-2 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">{plan.fileName}</p>
                    <p className="text-xs text-muted-foreground">
                      Загружен: {format(new Date(plan.uploadedAt), "dd.MM.yyyy")}
                    </p>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => document.getElementById("file")?.click()}
                >
                  Заменить
                </Button>
                <Input
                  id="file"
                  type="file"
                  className="hidden"
                  accept=".pdf,.doc,.docx,.xls,.xlsx"
                  onChange={handleFileChange}
                />
              </div>
            ) : (
              <div className="flex items-center justify-between p-2 border rounded-md">
                <div className="flex items-center">
                  <div className="ml-2 truncate">
                    <p className="text-sm font-medium">{file.name}</p>
                    <p className="text-xs text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} МБ</p>
                  </div>
                </div>
                <Button type="button" variant="ghost" size="sm" onClick={() => setFile(null)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Отмена
            </Button>
            <Button type="submit" disabled={!endDate || isUploading}>
              {isUploading ? "Сохранение..." : "Сохранить изменения"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
