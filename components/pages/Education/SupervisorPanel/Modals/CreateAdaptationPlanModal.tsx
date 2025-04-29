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
import { CalendarIcon, Upload, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"

interface CreateAdaptationPlanModalProps {
  isOpen: boolean
  onClose: () => void
  employee: any
}

export function CreateAdaptationPlanModal({ isOpen, onClose, employee }: CreateAdaptationPlanModalProps) {
  const [file, setFile] = useState<File | null>(null)
  const [endDate, setEndDate] = useState<Date | undefined>(new Date(new Date().setMonth(new Date().getMonth() + 3)))
  const [isUploading, setIsUploading] = useState(false)
  const { toast } = useToast()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!file) {
      toast({
        title: "Ошибка",
        description: "Пожалуйста, выберите файл плана адаптации",
        variant: "destructive",
      })
      return
    }

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

      // In a real implementation, you would upload the file to your server
      // const formData = new FormData()
      // formData.append("file", file)
      // formData.append("employeeId", employee.id)
      // formData.append("endDate", endDate.toISOString())

      // await api.post("/api/supervisor/adaptation/plan", formData)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "План адаптации загружен",
        description: `План адаптации для ${employee.surname} ${employee.name} успешно загружен`,
      })

      onClose()
    } catch (error) {
      console.error("Error uploading adaptation plan:", error)
      toast({
        title: "Ошибка загрузки",
        description: "Не удалось загрузить план адаптации. Пожалуйста, попробуйте еще раз.",
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
          <DialogTitle>Добавить план адаптации</DialogTitle>
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
                <Calendar
                  mode="single"
                  selected={endDate}
                  onSelect={setEndDate}
                  initialFocus
                  disabled={(date) => date < new Date()}
                  locale={ru}
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label htmlFor="file">Файл плана адаптации</Label>
            {!file ? (
              <div className="border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center">
                <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground mb-2">Перетащите файл сюда или нажмите для выбора</p>
                <Input
                  id="file"
                  type="file"
                  className="hidden"
                  accept=".pdf,.doc,.docx,.xls,.xlsx"
                  onChange={handleFileChange}
                />
                <Button type="button" variant="outline" onClick={() => document.getElementById("file")?.click()}>
                  Выбрать файл
                </Button>
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
            <Button type="submit" disabled={!file || !endDate || isUploading}>
              {isUploading ? "Загрузка..." : "Загрузить план"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
