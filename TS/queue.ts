/**
 * Created by vigon on 14/06/2017.
 */



module mathis{


    class TaskForQueue{
        action:()=>void
        timeout

        constructor(action:()=>void,addTimeout=false){
            if(addTimeout) this.action=()=>{
                this.timeout=setTimeout(action,0)
            }
            else this.action=action
        }

        dispose(){
            if (this.timeout!=null) clearTimeout(this.timeout)
        }


    }

    export class Queue{

        /**if true, the queue is working*/
        active=false
        private tasks=new Array<TaskForQueue>()

        currentIndex=-1

        private stopped=false
        stop(){this.stopped=true}


        nextOne():void{
            this.currentIndex++
            if (this.currentIndex<this.tasks.length){
                var activeTask=this.tasks[this.currentIndex];
                activeTask.action();
            }
            else this.active=false

        }

        sameOne():void{
            var activeTask=this.tasks[this.currentIndex];
            activeTask.action();
        }

        pushGroupOfTask(taskActions:Array<()=>void>,addTimeout=false):void{
            taskActions.forEach((func:()=>void)=>{
                 this.tasks.push(new TaskForQueue(func,addTimeout))
            })

            if (!this.active) {
                this.nextOne()
                this.active=true
            }
        }

        /**useful if we introduce small timeout between task.
         * */
        dispose(){
            for (let task of this.tasks){
                task.dispose()
            }
        }







    }





}