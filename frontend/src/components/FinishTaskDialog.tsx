import React from 'react'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './ui/alert-dialog'
import useTaskStore from '@/stores/useTaskStore';

const FinishTaskDialog = ({ isOpen, onOpenChange }) => {
    const { selectedTask, finishTaskUser } = useTaskStore();

    const handleFinishTask = () => {
        if (selectedTask) {
            finishTaskUser(selectedTask.id);
        }
      };

  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
    <AlertDialogTrigger asChild>
    </AlertDialogTrigger>
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Czy na pewno chcesz oznaczyć zlecenie jako zakończone?</AlertDialogTitle>
        <AlertDialogDescription>
          Ta akcja jest nieodwracalne. Zanaczając tę opcję, potwierdzasz, że fachowiec wypełnił wszystkie swoje obowiązki.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Anuluj</AlertDialogCancel>
        <AlertDialogAction onClick={()=>handleFinishTask()} className="bg-green-500 text-slate-50 hover:bg-green-500/90 dark:bg-green-900 dark:text-slate-50 dark:hover:bg-green-900/90">Zakończ zlecenie</AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
  )
}

export default FinishTaskDialog