"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { FileText, AlertTriangle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface DeleteAdaptationPlanModalProps {
  isOpen: boolean
  onClose: () => void
  employee: any
  plan: any
}

export function DeleteAdaptationPlanModal({ isOpen, onClose, employee, plan }: DeleteAdaptationPlanModalProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const { toast } = useToast()

  const handleDelete = async () => {
    try {
      setIsDeleting(true)

      // In a real implementation, you would delete the plan on your server
      // await api.delete(`/api/supervisor/adaptation/plan/${plan.id}`)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "План адаптации удален",
        description: `План адаптации для ${employee.surname} ${employee.name} успешно удален`,
      })

      onClose()
    } catch (error) {
      console.error("Error deleting adaptation plan:", error)
      toast({
        title: "Ошибка удаления",
        description: "Не удалось удалить план адаптации. Пожалуйста, попробуйте еще раз.",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Удалить план адаптации</DialogTitle>
          <DialogDescription>
            Вы уверены, что хотите удалить план адаптации для этого сотрудника? Это действие нельзя отменить.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <div className="p-3 bg-muted rounded-md mb-4">
            <div className="font-medium">
              {employee?.surname} {employee?.name} {employee?.patronymic}
            </div>
            <div className="text-sm text-muted-foreground">{employee?.position}</div>
          </div>

          <div className="flex items-center p-3 border rounded-md bg-red-50">
            <AlertTriangle className="h-5 w-5 text-red-500 mr-3" />
            <div>
              <p className="text-sm font-medium">Будет удален файл:</p>
              <div className="flex items-center mt-1">
                <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                <p className="text-sm">{plan.fileName}</p>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Отмена
          </Button>
          <Button type="button" variant="destructive" onClick={handleDelete} disabled={isDeleting}>
            {isDeleting ? "Удаление..." : "Удалить план"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
