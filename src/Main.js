import React from 'react';
import './style.css';

export default class Main extends React.Component {
  componentWillMount(){
    this.reset();
  }
  reset(){
    let colors=[0,0,30,30,60,60,120,120,180,180,240,240,270,270,320,320];
    colors.sort(()=>0.5-Math.random());//тасуем цвета в случайном порядке
    let grid=colors.map(item=>{return {opened:false,selected:false,color:item}});
    this.setState({grid,selectedCellsCount:0,openedCellsCount:0,started:false,time:"00:00.000"});
  }
  start(){
    this.reset();
    this.setState({startTime:Date.now(),timer:setTimeout(this.onTimer.bind(this),1),started:true});
  }
  onTimer(){
    if(this.state.started===false)return;
    let time=Date.now()-this.state.startTime;
    let min=Math.round(time/60000);
    min=min<10?"0"+min:min;
    let sec=Math.round(time/1000);
    sec=sec<10?"0"+sec:sec;
    let mill=time%1000;
    this.setState({time:`${min}:${sec}.${mill}`,timer:setTimeout(this.onTimer.bind(this),1)});
  }
  end(){
    setTimeout(()=>alert('Вы выиграли!\nЗатраченное время: '+this.state.time),100);
    this.setState({started:false});
  }
  onClick(index){
    if(this.state.started===false) return; //если игра не запущена - выход
    let state=Object.assign({},this.state);
    state.grid=Object.assign([],this.state.grid);
    if(state.grid[index].opened===true)return; //если клик по уже открытой клетке - выход
    state.selectedCellsCount++;//увеличиваем счетчик выбранных клеток
    if(state.selectedCellsCount>2)return; //предотвращение выбора более 2-х клеток одновременно
    state.grid[index].selected=!state.grid[index].selected;//
    if(state.selectedCellsCount>1) {//если выбрано более одной клетки
        if(index===state.prevCellIndex) {
                //если текущий и предыдущий индексы совпадают - сбрасываем счетчик
                state.selectedCellsCount=0;
              }
              else//если текущий и предыдущий индексы НЕ совпадают - проверяем цвета
              if(state.grid[state.prevCellIndex].color===state.grid[index].color) {
                //если цвета совпали
                state.grid[state.prevCellIndex].opened=true;
                state.grid[index].opened=true;
                state.prevCellIndex=-1;
                state.openedCellsCount+=2;
                state.selectedCellsCount=0;
                //если все клетки открыты - конец
                if(state.openedCellsCount===16) setImmediate(this.end.bind(this));
                }else{ //если цвета не совпали - закрываем ячейки после небольшой задержки
                      setTimeout(()=>{
                            state.grid[state.prevCellIndex].selected=false;
                            state.grid[index].selected=false;
                            state.selectedCellsCount=0;
                            this.setState(state);
                            },200);
                    }
        }
        else {//если выбрана только одна клетка - запоминаем ее индекс
          state.prevCellIndex=index;
          }
          
    this.setState(state); 
  }

  render(){
    let grid=this.state.grid.map((item,index)=>{
      let color=item.opened||item.selected?`hsl(${item.color},100%,50%)`:"white";
      return <div className="cell" style={{backgroundColor:color}}
          key={index}
          onClick={this.onClick.bind(this,index)}>
          </div>
          });
    return <div className="main">
              <div className="grid">
              {grid}
              </div>
              <input type="button" value="Старт" onClick={this.start.bind(this)}/>
              <br/>
              {this.state.time}  
              </div>
  
  }
}


