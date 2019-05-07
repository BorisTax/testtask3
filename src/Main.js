import React from 'react';
import './style.css';

export default class Main extends React.Component {
  constructor(){
    super();
    this.reset();
  }
  componentWillMount(){
    this.reset();
  }
  reset(){
    let colors=[0,0,30,30,60,60,120,120,180,180,240,240,270,270,320,320];
    colors.sort(()=>0.5-Math.random());//тасуем цвета в случайном порядке
    let grid=colors.map(item=>{return {opened:false,selected:false,color:item}});
    this.setState({grid,prevCellIndex:-1,selectedCellsCount:0,openedCellsCount:0,started:false});
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
    this.setState({time:min+":"+sec+"."+mill,timer:setTimeout(this.onTimer.bind(this),1)});
  }
  end(){
    setTimeout(()=>alert('Вы выиграли!\nЗатраченное время: '+this.state.time),100);
    this.setState({started:false});
  }
  onClick(index){
    if(this.state.started===false) return;
    let state=Object.assign({},this.state);
    state.grid=Object.assign([],this.state.grid);
    
    if(state.grid[index].opened===true)return;
    if(state.selectedCellsCount>1)return;
    state.selectedCellsCount++;
    state.grid[index].selected=!state.grid[index].selected;
    if(state.prevCellIndex!==-1) {
        if(index===state.prevCellIndex) {state.prevCellIndex=-1;state.selectedCellsCount=0;}else
        if(state.grid[state.prevCellIndex].color===state.grid[index].color) {
          state.grid[state.prevCellIndex].opened=true;
          state.grid[index].opened=true;
          state.prevCellIndex=-1;
          state.openedCellsCount+=2;
          state.selectedCellsCount=0;
          if(state.openedCellsCount===16) setImmediate(this.end.bind(this));
          }else{ 
                setTimeout(()=>{
                      state.grid[state.prevCellIndex].selected=false;
                      state.prevCellIndex=-1;
                      state.grid[index].selected=false;
                      state.selectedCellsCount=0;
                      this.setState(state);
                      },200);
                this.setState(state);   
              }
        }
        else {
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


