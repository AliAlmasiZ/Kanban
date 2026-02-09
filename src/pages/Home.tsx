import BackgroundCanvas from '@/components/BackgroundCanvas';
import Column from '../components/Column';
import type { TaskItem } from '@/types/kanban';
import TaskCard from '@/components/TaskCard';

// I HATE STYLING

export default function Home() {
  return (
    <>
      <BackgroundCanvas />
      <div className="container mx-auto p-10 h-screen grid grid-cols-1 grid-rows-3 lg:grid-cols-3 lg:grid-rows-1 gap-13 items-stretch">
        <Column title='TODO'>
         {/* <TaskCard task={id: "123" } />  */} s
         </Column>
        <Column title='DONE'> </Column>
        <Column title='IN PROGRESS'> </Column>
      </div>
    </>
  );
}
