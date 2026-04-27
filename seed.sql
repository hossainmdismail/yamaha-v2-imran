USE yamaha_ai;

-- 1. Insert Realistic Yamaha Bikes
INSERT INTO bikes (model_name, type, description, image_url) VALUES 
('Yamaha R15M', 'Supersport', 'The racing legend. Perfectly tuned for the track and aggressive high-speed riding.', '/bikes/r15m.png'),
('Yamaha MT-15 V2', 'Hyper Naked', 'The dark warrior of the streets. Agile, torquey, and aggressive for the ultimate night rider.', '/bikes/mt15.png'),
('Yamaha FZ-X', 'Neo-Retro', 'Ride free with the crossover motorcycle designed for both city commute and light touring.', '/bikes/fzx.png'),
('Yamaha Aerox 155', 'Maxi-Sports Scooter', 'The ultimate performance scooter that redefines your daily urban commute with speed and style.', '/bikes/aerox.png');

-- Set variable IDs for bikes to map rules safely
SET @r15m = (SELECT id FROM bikes WHERE model_name = 'Yamaha R15M' LIMIT 1);
SET @mt15 = (SELECT id FROM bikes WHERE model_name = 'Yamaha MT-15 V2' LIMIT 1);
SET @fzx = (SELECT id FROM bikes WHERE model_name = 'Yamaha FZ-X' LIMIT 1);
SET @aerox = (SELECT id FROM bikes WHERE model_name = 'Yamaha Aerox 155' LIMIT 1);

-- 2. Insert Quiz Rules
-- Note: Traits in the code are sorted alphabetically and joined by a comma before matching.
-- Options Q1: 'Daily Commuter', 'Speed Enthusiast', 'Weekend Explorer'
-- Options Q2: 'Mountain Trails', 'Urban', 'Urban Nightscapes'

INSERT INTO rules (trait_combination, assigned_bike_id) VALUES 
('Speed Enthusiast,Urban', @r15m),
('Speed Enthusiast,Urban Nightscapes', @mt15),
('Mountain Trails,Speed Enthusiast', @mt15),

('Urban,Weekend Explorer', @fzx),
('Urban Nightscapes,Weekend Explorer', @mt15),
('Mountain Trails,Weekend Explorer', @fzx),

('Daily Commuter,Urban', @aerox),
('Daily Commuter,Urban Nightscapes', @aerox),
('Daily Commuter,Mountain Trails', @fzx);

-- 3. Insert Active Prompt Template for Gemini
INSERT INTO prompts (prompt_template, is_active) VALUES 
('Create a highly detailed, premium cinematic portrait of the uploaded person standing confidently next to a {{bike_model}}. Preserve the person''s face, identity, age, and outfit style as accurately as possible. Scene: {{destination}}. The mood should be a luxury automotive campaign with dramatic studio lighting, realistic reflections, and ultra-realistic textures. Ensure the motorcycle geometry is accurate. 4:5 vertical portrait composition. Avoid cartoon styles, distorted faces, or extra limbs.', TRUE);
