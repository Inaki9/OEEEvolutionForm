$(document).ready(function(){

	var ratioDisponibilidad = 0.9;
	var ratioRendimiento = 0.8;
	var ratioCalidad = 0.7;
	var cont = 0;
	var ratio;
	var graphic;
	var sliderD, sliderR, sliderC;

	$( ".slider" ).draggable({
		containment: "parent",
		axis: "y",
		create: function(e,ui) {
			cont++;
			if(!this.par){
				this.par = $(this).parent();
				this.parName = this.par.parent().prop('className');
				this.parHeight = this.par.height()-12;
				this.height = $(this).height();
			}

			if(this.parName == 'disponibilidad'){
				graphic = "D";
				ratio = ratioDisponibilidad;
				sliderD = $(this);
			}else if(this.parName == 'rendimiento'){
				graphic = "R";
				ratio = ratioRendimiento;
				sliderR = $(this);
			}else if(this.parName == 'calidad'){
				graphic = "C";
				ratio = ratioCalidad;
				sliderC = $(this);
			}

			resizeBar(graphic,this.parHeight,ratio);
			updateCounter(graphic,ratio);
			resizeHandler(this.parHeight,ratio,$(this));

			if(cont => 2){
				resizeOeeBar(this.parHeight,ratioDisponibilidad,ratioRendimiento,ratioCalidad);
			}
		},
		drag: function(e,ui){
			ratio = 1-(ui.position.top)/this.parHeight;

			if(this.parName == 'disponibilidad'){
				graphic = "D";
				ratioDisponibilidad = ratio;
			}else if(this.parName == 'rendimiento'){
				graphic = "R";
				ratioRendimiento = ratio;
			}else if(this.parName == 'calidad'){
				graphic = "C";
				ratioCalidad = ratio;
			}

			resizeBar(graphic,this.parHeight,ratio);
			updateCounter(graphic,ratio);
			resizeOeeBar(this.parHeight,ratioDisponibilidad,ratioRendimiento,ratioCalidad);
		}
    });

	$(".counter").change(function(){
		this.counterName = $(this).prop('className');
		var slice = this.counterName.slice(-1);
		var graphicHeight = $('.graphic'+slice).height();
		var ratio = ($('.counter'+slice).val())/100;
		var slider;
		if(slice == 'D'){
			slider = sliderD;
			ratioDisponibilidad = ratio;
		}else if(slice == 'R'){
			slider = sliderR;
			ratioRendimiento = ratio;
		}else if(slice == 'C'){
			slider = sliderC;
			ratioCalidad = ratio;
		}
		resizeHandler(graphicHeight,ratio,slider);
		resizeBar(slice,graphicHeight,ratio);
		resizeOeeBar(graphicHeight,ratioDisponibilidad,ratioRendimiento,ratioCalidad);
	});

});

function resizeHandler(graphicHeight, ratio, slider){
	var top = (graphicHeight-(graphicHeight*ratio));
	var str = top+"px";
	slider.css({'top': str});
}

function resizeBar(graphic, parHeight, ratio){
	var top = (parHeight-(parHeight*ratio));
	var str = top+"px";
	$('.graphicFull.'+graphic).css({'top': str});
	$('.graphicFull.'+graphic).height(parHeight*ratio);
}

function updateCounter(counter, ratio){
	var percent = parseFloat(ratio*100).toFixed(1);
	if(counter == 'O'){
		$('.counter.'+counter).text(percent+'%')
	}else{
		$('.counter'+counter).val(percent);
	}
	
}

function resizeOeeBar(totalHeight, ratioDisponibilidad, ratioRendimiento, ratioCalidad){
	var ratioOee = ratioDisponibilidad*ratioRendimiento*ratioCalidad;
	var top = (totalHeight-(totalHeight*ratioOee));
	var strOee = top+"px";
	$(".graphicFull.O").height(totalHeight*ratioOee);
	if((ratioOee*100) >= 90){
		$('.graphicFull.O').css({'top': strOee, 'background-image': 'url("img/oee-verde.png")'});
	}else if((ratioOee*100) >= 60){
		$('.graphicFull.O').css({'top': strOee, 'background-image': 'url("img/oee-naranja.png")'});
	}else{
		$('.graphicFull.O').css({'top': strOee, 'background-image': 'url("img/oee-rojo.png")'});
	}

	updateCounter("O",ratioOee);
}