(function(){
	var Queue = function(params){
		var defaultParams = {
			types: {
				CONSEQUENTIALLY: 'consequentially',
				POOL: 'pool'
			}
		};

		var list = [],
			active = false,
			delay = 1000,
			runnedTasks = 0,
			type = params.type || defaultParams.types.CONSEQUENTIALLY,
			simultaneously = params.simultaneously;


		var addTask = function(task){
				list.push(task);
				if(type === defaultParams.types.CONSEQUENTIALLY){
					startConsequentiallyProcessing();
				}else if(type === defaultParams.types.POOL){
					startPoolProcessing();
				}
				
			},
			addPriorTask = function(task){
				list.unshift(task);
				startConsequentiallyProcessing();
			},

			startPoolProcessing = function(){
				if(runnedTasks === simultaneously){
					return false;
				}

				if(!list.length){
					active = false;
					return;
				}

				active = true;

				runTask();
			},

			startConsequentiallyProcessing = function(){
				if(active){
					return;
				}

				if(!list.length){
					return;
				}

				active = true;

				runTask();
			},
			runTask = function(){

				try{
					var quItem = list.shift();
					if(type === defaultParams.types.CONSEQUENTIALLY){
						setTimeout(quItem.task.bind(this, next.bind(this)), delay);	
					}else if(type === defaultParams.types.POOL){
						quItem.task(next);
					}
					
					runnedTasks++;
				}catch(e){
					next();
					console.warn(e);
				}
			},
			next = function(){
				//console.log('NEXT');

				if(!list.length){
					active = false;
					return active;
				}
				runnedTasks--;
				runTask();
			};

		
		return {
			addTask: addTask
		}
		
	};

	this.queue = {
		getConsequentiallyTaskRunner: function(){
			return new Queue({type: 'consequentially'});
		},
		getPoolTaskRunner: function(){
			return new Queue({type: 'pool', simultaneously: 2});
		}

	}
}())
