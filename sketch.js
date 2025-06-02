// Enhanced sketch.js - Redesigned Central Hub - FIXED VERSION

// --- Configuration & Palette (mostly unchanged) ---
let canvasWidth = 1200;
let canvasHeight = 1000;
let centerX, centerY;

const palette = {
    bg: '#F8F9FA',
    bgGradientEnd: '#E9ECEF',
    reflectiveCircle: '#CED4DA',
    textDark: '#212529',
    textMedium: '#495057',
    textLight: '#F8F9FA',
    accent: '#0077B6',
    accentDarker: '#005A8D',
    stage1: '#F9A825', stage1Darker: '#F39C12',
    stage2: '#E53935', stage2Darker: '#D32F2F',
    stage3: '#4CAF50', stage3Darker: '#388E3C',
    stage4: '#1E88E5', stage4Darker: '#1976D2',
    hubBackground: '#E9ECEF',
    hubGradientMid: '#DEE2E6',
    hubGradientOuter: '#D0D5DA',
    hubBorder: '#ADB5BD',
    shadowColor: 'rgba(0, 0, 0, 0.08)',
    shadowColorDarker: 'rgba(0, 0, 0, 0.12)'
};

let hubData;
let processStagesData;

function setup() {
    let canvas = createCanvas(canvasWidth, canvasHeight);
    canvas.parent('canvas-container');
    centerX = width / 2;
    centerY = height / 2;
    angleMode(DEGREES);
    textFont('Arial');

    // --- Central Hub Data (Redesigned Structure) ---
    hubData = {
        radius: 220, // Main hub radius, slightly adjusted
        position: { x: centerX, y: centerY },
        kernvakgebieden: { // Outer ring of items within the hub
            radius: 160, // Radius for placing KVK items/icons
            items: [
                { name: "Strategisch Mgt.", icon: "♟️", angle: 0 },     // Right
                { name: "Operations Mgt.", icon: "🏭", angle: 90 },    // Bottom
                { name: "Organizational Behavior", icon: "👥", angle: 180 },// Left
                { name: "Information Mgt.", icon: "💻", angle: 270 }   // Top
            ]
        },
        handelingscyclus: { // Innermost elements
            radius: 100, // Radius of the dashed circle (must be < kernvakgebieden.radius)
            items: [
                { name: "Diagnose", icon: "🔍", angle: 45 },
                { name: "Ontwerp", icon: "⚙️", angle: 135 },
                { name: "Verandering", icon: "🦋", angle: 225 },
                { name: "Evaluatie", icon: "✅", angle: 315 }
            ]
        }
    };

    // --- Process Stages Data - FIXED positioning for better centering ---
    const stageWidth = 300;
    const stageHeight = 180;
    // Reduced distances to better center the overall diagram
    const stageDistanceX = hubData.radius + stageWidth * 0.65;
    const stageDistanceY = hubData.radius + stageHeight * 0.62;

    processStagesData = [
        {
            id: 'stage1', title: "Persoonlijk Leiderschap & Vakmanschap",
            text: "Zelfstandig, moreel kompas en zelfreflectie.",
            icons: "🧭🪞🛠️", color: palette.stage1, colorDarker: palette.stage1Darker,
            position: { x: centerX - stageDistanceX, y: centerY - stageDistanceY },
            width: stageWidth, height: stageHeight
        },
        {
            id: 'stage2', title: "Analyseren & Scenarioplanning",
            text: "Analyse met modellen & data; creatie van scenario's.",
            icons: "🔍📊🌍", color: palette.stage2, colorDarker: palette.stage2Darker,
            position: { x: centerX + stageDistanceX, y: centerY - stageDistanceY },
            width: stageWidth, height: stageHeight
        },
        {
            id: 'stage3', title: "Samenwerking & Waardevolle Oplossingen",
            text: "Afstemming over functionele gebieden en organisaties voor meervoudige waarde.",
            icons: "⚙️🌐💡", color: palette.stage3, colorDarker: palette.stage3Darker,
            position: { x: centerX + stageDistanceX, y: centerY + stageDistanceY },
            width: stageWidth, height: stageHeight
        },
        {
            id: 'stage4', title: "Doelen Realiseren & Terugkoppeling",
            text: "Methodisch handelen (evidence-based) van probleemidentificatie tot evaluatie.",
            icons: "🏁📈↩️", color: palette.stage4, colorDarker: palette.stage4Darker,
            position: { x: centerX - stageDistanceX, y: centerY + stageDistanceY },
            width: stageWidth, height: stageHeight
        }
    ];
}

function applyShadow(offsetX = 4, offsetY = 4, blur = 8, color = palette.shadowColor) {
    drawingContext.shadowOffsetX = offsetX;
    drawingContext.shadowOffsetY = offsetY;
    drawingContext.shadowBlur = blur;
    drawingContext.shadowColor = color;
}

function clearShadow() {
    drawingContext.shadowOffsetX = 0;
    drawingContext.shadowOffsetY = 0;
    drawingContext.shadowBlur = 0;
    drawingContext.shadowColor = 'rgba(0,0,0,0)';
}

function draw() {
    let bgGradient = drawingContext.createLinearGradient(0, 0, 0, height);
    bgGradient.addColorStop(0, palette.bg);
    bgGradient.addColorStop(1, palette.bgGradientEnd);
    drawingContext.fillStyle = bgGradient;
    rect(0, 0, width, height);

    drawReflectiveOuterCircle();
    drawProcessStages();
    drawConnectionArrows();
    drawCentralHub(); // Drawn last
}

function drawReflectiveOuterCircle() {
    push();
    noFill();
    stroke(palette.reflectiveCircle);
    strokeWeight(2);
    drawingContext.setLineDash([5, 9]);
    let maxDist = 0;
    processStagesData.forEach(stage => {
        let d = dist(centerX, centerY, stage.position.x, stage.position.y);
        if (d > maxDist) maxDist = d;
    });
    let circleRadius = maxDist + Math.max(processStagesData[0].width, processStagesData[0].height) * 0.6;
    circle(centerX, centerY, circleRadius * 2);
    drawingContext.setLineDash([]);
    pop();
}

function drawCentralHub() {
    push();
    translate(hubData.position.x, hubData.position.y); // Center of the hub

    // Apply shadow to the main hub circle
    applyShadow(6, 6, 18, palette.shadowColorDarker);

    // Hub Main Circle with Radial Gradient
    let hubGradient = drawingContext.createRadialGradient(0, 0, 0, 0, 0, hubData.radius);
    hubGradient.addColorStop(0, palette.hubBackground);
    hubGradient.addColorStop(0.8, palette.hubGradientMid);
    hubGradient.addColorStop(1, palette.hubGradientOuter);
    drawingContext.fillStyle = hubGradient;
    stroke(palette.hubBorder);
    strokeWeight(2.5);
    circle(0, 0, hubData.radius * 2);
    clearShadow();

    // --- Kernvakgebieden (KVK) - Outer ring inside hub - FIXED positioning ---
    const kvk = hubData.kernvakgebieden;
    const kvkIconSize = 32;
    const kvkTextSize = 16;
    const kvkGlobalHorizontalLift = -4;
    const kvkGlobalVerticalLift = -10; // NEW: Negative value to lift items upwards. Adjust as needed (e.g., -5, -10).

    kvk.items.forEach(item => {
        let x_icon_base = kvk.radius * cos(item.angle);
        let y_icon_base = kvk.radius * sin(item.angle);

        // Apply the global vertical lift to the base y position
        let x_icon_lifted = x_icon_base + kvkGlobalHorizontalLift;
        let y_icon_lifted = y_icon_base + kvkGlobalVerticalLift;

        // Draw KVK Icon
        fill(palette.textDark);
        textSize(kvkIconSize);
        textAlign(CENTER, CENTER);
        text(item.icon, x_icon_lifted, y_icon_lifted); // Use lifted y

        // FIXED: Draw KVK Name - always centered below the icon
        fill(palette.textMedium);
        textSize(kvkTextSize);
        textStyle(NORMAL);
        textAlign(CENTER, CENTER);
        
        let textOffsetY = 22; // Fixed distance below icon
        // let textWidth = 10; // OLD: This is too small and will cause text wrapping issues.
        let textWidth = 10; // SUGGESTED CHANGE: Increased width for better text readability. Adjust if needed.

        // All text positioned centered below their respective icons, using the lifted base y
        text(item.name, x_icon_lifted, y_icon_lifted + textOffsetY, textWidth, 35); // Use lifted y
    });

    // --- Handelingscyclus (HC) - Innermost elements ---
    const hc = hubData.handelingscyclus;

    // Inner dashed circle for HC
    push();
    noFill();
    stroke(palette.accent);
    strokeWeight(1.5);
    drawingContext.setLineDash([4, 4]);
    circle(0, 0, hc.radius * 2); // Centered at (0,0) of the hub
    drawingContext.setLineDash([]);
    pop();

    // HC Items - INCREASED text sizes for better readability
    const hcItemTextSize = 16; 
    const hcItemIconSize = 32; 
    textStyle(NORMAL);

    hc.items.forEach(item => {
        let itemRadiusMultiplier = 0.75; 
        let x = hc.radius * itemRadiusMultiplier * cos(item.angle);
        let y = hc.radius * itemRadiusMultiplier * sin(item.angle); 

        textAlign(CENTER, CENTER);
        
        fill(palette.textDark);
        textSize(hcItemIconSize);
        text(item.icon, x, y - 12); 
        
        fill(palette.textMedium);
        textSize(hcItemTextSize);
        text(item.name, x, y + 14); 
    });

    fill(palette.accent);
    textSize(80); 
    textAlign(CENTER, CENTER);
    text('↻', 0, 0); 

    pop(); // End of hub drawing
}

function drawProcessStages() {
    processStagesData.forEach(stage => {
        push();
        translate(stage.position.x, stage.position.y);
        applyShadow(4, 4, 12, palette.shadowColor);

        let stageGradient = drawingContext.createLinearGradient(0, -stage.height / 2, 0, stage.height / 2);
        stageGradient.addColorStop(0, stage.color);
        stageGradient.addColorStop(1, stage.colorDarker);
        drawingContext.fillStyle = stageGradient;

        noStroke();
        rectMode(CENTER);
        let cornerRadius = 28;
        rect(0, 0, stage.width, stage.height, cornerRadius);
        clearShadow();

        textAlign(CENTER, CENTER);
        const padding = 12;
        const contentWidth = stage.width - 2 * padding;

        // Icons - properly positioned at top
        fill(palette.textLight);
        textSize(38);
        text(stage.icons, 0, -stage.height / 2 + padding + 30);

        // Title - with proper spacing from icons
        textSize(18);
        textStyle(BOLD);
        // --- Calculate Y position for Title ---
        let titleTextCenterY = -stage.height / 2 + padding + 82;
        let titleBoxHeight = 50; // This is the height used in the original text() call for the title
        text(stage.title, 0, titleTextCenterY, contentWidth, titleBoxHeight);

        // --- Calculate Y position for Description Text ---
        let titleTextBottomEdge = titleTextCenterY + titleBoxHeight / 2;
        
        let descriptionBoxHeight = 30; // This is the height used in the original text() call for the description
        let desiredGap = 8; // pixels - Adjust this value to increase/decrease the margin
        
        let descriptionTextCenterY = titleTextBottomEdge + desiredGap + (descriptionBoxHeight / 2);

        // Description text - positioned below title with the new calculated Y
        textSize(14);
        textStyle(NORMAL);
        // Original line: text(stage.text, 0, stage.height / 2 - padding - 35, contentWidth * 0.98, 45);
        text(stage.text, 0, descriptionTextCenterY, contentWidth * 0.98, descriptionBoxHeight);
        pop();
    });
}

function drawArrow(fromX, fromY, toX, toY, options = {}) {
    const {
        color = palette.accent,
        headSize = 15,
        strokeWeightVal = 3.5,
        isDashed = false,
        dashPattern = [7, 7]
    } = options;

    push();
    stroke(color);
    strokeWeight(strokeWeightVal);
    fill(color);

    if (isDashed) {
        drawingContext.setLineDash(dashPattern);
    }

    line(fromX, fromY, toX, toY);

    let angle = atan2(toY - fromY, toX - fromX);
    translate(toX, toY);
    rotate(angle);

    beginShape();
    vertex(0, 0);
    vertex(-headSize, -headSize / 2.2);
    vertex(-headSize * 0.8, 0);
    vertex(-headSize, headSize / 2.2);
    endShape(CLOSE);
    
    if (isDashed) {
        drawingContext.setLineDash([]);
    }
    pop();
}

function drawConnectionArrows() {
    const numStages = processStagesData.length;
    const arrowMarginFromEdge = 10;

    for (let i = 0; i < numStages; i++) {
        let currentStage = processStagesData[i];
        let nextStage = processStagesData[(i + 1) % numStages];
        let dx = nextStage.position.x - currentStage.position.x;
        let dy = nextStage.position.y - currentStage.position.y;
        let angleToNext = atan2(dy, dx);

        let startX = currentStage.position.x;
        let startY = currentStage.position.y;
        let endX = nextStage.position.x;
        let endY = nextStage.position.y;

        // Adjust start/end points to approximate edge of rounded rects
        if (abs(dx) > abs(dy)) { // More horizontal arrow
            startX += (currentStage.width / 2 + arrowMarginFromEdge) * Math.sign(dx);
            endX -= (nextStage.width / 2 + arrowMarginFromEdge) * Math.sign(dx);
        } else { // More vertical arrow
            startY += (currentStage.height / 2 + arrowMarginFromEdge) * Math.sign(dy);
            endY -= (nextStage.height / 2 + arrowMarginFromEdge) * Math.sign(dy);
        }
        
        drawArrow(startX, startY, endX, endY, {
            color: palette.accent,
            headSize: 13,
            strokeWeightVal: 3
        });
    }

    let lastStage = processStagesData[numStages - 1];
    let dxToHub = hubData.position.x - lastStage.position.x;
    let dyToHub = hubData.position.y - lastStage.position.y;
    let angleToHub = atan2(dyToHub, dxToHub);

    let startX_lh = lastStage.position.x;
    let startY_lh = lastStage.position.y;

    if (abs(dxToHub) > abs(dyToHub)) { // Arrow is more horizontal
        startX_lh += (lastStage.width / 2 + arrowMarginFromEdge) * Math.sign(dxToHub);
    } else { // Arrow is more vertical
        startY_lh += (lastStage.height / 2 + arrowMarginFromEdge) * Math.sign(dyToHub);
    }
    
    let endX_lh = hubData.position.x - (hubData.radius + arrowMarginFromEdge) * cos(angleToHub);
    let endY_lh = hubData.position.y - (hubData.radius + arrowMarginFromEdge) * sin(angleToHub);

}