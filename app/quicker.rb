require 'opal'
require 'opal-jquery'
require 'ostruct'
 
class Grid
	attr_reader :height, :width, :canvas, :context, :max_x, :max_y

	CELL_HEIGHT = 50;
	CELL_WIDTH  = 100;

	def initialize
		@height  = `200`                  
		@width   = `500`                   
		@canvas  = `document.getElementById(#{canvas_id})` 
		@context = `#{canvas}.getContext('2d')`
		@max_x   = (height / CELL_HEIGHT).floor           
		@max_y   = (width / CELL_WIDTH).floor   
	end

	def draw_canvas
		`#{canvas}.width  = #{width}`
		`#{canvas}.height = #{height}`

		x = 0.5
		until x >= width do
			`#{context}.moveTo(#{x}, 0)`
			`#{context}.lineTo(#{x}, #{height})`
			x += CELL_WIDTH
		end

		y = 0.5
		until y >= height do
			`#{context}.moveTo(0, #{y})`
			`#{context}.lineTo(#{width}, #{y})`
			y += CELL_HEIGHT
		end

		`#{context}.strokeStyle = "#eee"`
		`#{context}.stroke()`
	end

	def fill_cell(x, y)
		x *= CELL_WIDTH;
		y *= CELL_HEIGHT;
		`#{context}.fillStyle = "#000"`
		`#{context}.fillRect(#{x.floor + 1}, #{y.floor + 1}, #{CELL_WIDTH - 1}, #{CELL_HEIGHT - 1})`
	end

	def canvas_id
		'quickerCanvas'
	end

	def get_cursor_position(event)
		`console.log(#{event})`

		if (event.page_x && event.page_y)
			x = event.page_x;
			y = event.page_y;
		else
			doc = Opal.Document[0]
			x = event[:clientX] + doc.scrollLeft + doc.documentElement.scrollLeft;
			y = event[:clientY] + doc.body.scrollTop + doc.documentElement.scrollTop;
		end

		x -= `#{canvas}.offsetLeft`
		y -= `#{canvas}.offsetTop`

		x = (x / CELL_WIDTH).floor
		y = (y / CELL_HEIGHT).floor

		Coordinates.new(x: x, y: y)
	end

	def add_mouse_event_listener

		isDragged = false
		chosenY = 0

		Element.find("##{canvas_id}").on :mousedown do |event|
			coords = get_cursor_position(event)
			x, y   = coords.x, coords.y
			chosenY = y
			fill_cell(x, chosenY)
			isDragged = true
		end

		Element.find("##{canvas_id}").on :mousemove do |event|
			if isDragged
				coords = get_cursor_position(event)
				x, y   = coords.x, coords.y
				fill_cell(x, chosenY)
			end
		end

		Element.find("##{canvas_id}").on :mouseout do |event|
			isDragged = false
		end

		Element.find("##{canvas_id}").on :mouseup do |event|
			if isDragged
				coords = get_cursor_position(event)
				x, y   = coords.x, coords.y
				fill_cell(x, chosenY)
				isDragged = false
			end
		end
	end
end

class Coordinates < OpenStruct; end
 
grid = Grid.new
grid.draw_canvas
grid.add_mouse_event_listener