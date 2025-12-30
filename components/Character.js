class Character {
  constructor({
    x,
    y,
    width,
    height,
    name,
    spritePath,
    facingRight = true,
    isPlayer = false,
    groundY,
    controls = {}
  }) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.name = name;
    this.spritePath = spritePath;
    this.facingRight = facingRight;
    this.isPlayer = isPlayer;
    this.controls = controls;

    // Physics
    this.velocityX = 0;
    this.velocityY = 0;
    this.speed = 5;
    this.jumpPower = -15;
    this.gravity = 0.8;
    this.groundY = groundY !== undefined ? groundY : 550;
    this.isOnGround = false;

    // Combat
    this.health = 100;
    this.maxHealth = 100;
    this.isAttacking = false;
    this.isBlocking = false;
    this.attackDamage = 10;
    this.attackCooldown = 0;
    this.attackDuration = 0;
    this.invulnerable = false;
    this.invulnerableTime = 0;

    // Animation
    this.currentState = 'idle';
    this.animationFrame = 0;
    this.animationSpeed = 0.15;
    this.animationTimer = 0;
    this.jumpPrepShown = false;
    this.attackState = null; // Will be set after loading sprites (kicking or punching)
    this.sprites = {
      idle: [],
      running: [],
      jumping: [],
      attacking: [],
      blocking: []
    };

    // States
    this.states = {
      idle: 'idle',
      running: 'running',
      jumping: 'jumping',
      attacking: 'attacking',
      blocking: 'blocking'
    };
  }

  async loadSprites() {
    const charName = this.spritePath.split('/').pop();
    
    // Auto-detect attack type by checking which folder exists
    // Try kicking first, then punching
    let attackType = 'kicking';
    let attackFolder = 'Kicking';
    try {
      const testImg = new Image();
      testImg.src = `${this.spritePath}/Kicking/${charName} 1.png`;
      await new Promise((resolve, reject) => {
        testImg.onload = resolve;
        testImg.onerror = reject;
      });
    } catch {
      attackType = 'punching';
      attackFolder = 'Punching';
    }

    this.attackState = attackType;
    
    // Generic sprite file pattern - works for any character
    const spriteFiles = {
      running: ['Running', `${charName} 1.png`, `${charName} Running 2.png`, `${charName} Running 3.png`, `${charName} 4.png`],
      jumping: ['Jumping', `${charName} 1.png`, `${charName} Jumping 2.png`, `${charName} Jumping 3.png`, `${charName} 4.png`],
      attacking: [attackFolder, `${charName} 1.png`, `${charName} ${attackFolder} 2.png`, `${charName} ${attackFolder} 3.png`, `${charName} 4.png`],
      blocking: ['Blocking', `${charName} 1.png`, `${charName} Blocking 2.png`, `${charName} Blocking 3.png`, `${charName} 4.png`]
    };
    
    // Load idle (use first running sprite)
    try {
      const idleImg = new Image();
      idleImg.src = `${this.spritePath}/Running/${charName} 1.png`;
      await new Promise((resolve, reject) => {
        idleImg.onload = resolve;
        idleImg.onerror = reject;
      });
      this.sprites.idle = [idleImg];
    } catch (e) {
      console.warn('Could not load idle sprite');
    }

    // Load all states generically
    for (const [stateKey, [folder, ...files]] of Object.entries(spriteFiles)) {
      this.sprites[stateKey] = [];
      
      for (const file of files) {
        try {
          const img = new Image();
          img.src = `${this.spritePath}/${folder}/${file}`;
          await new Promise((resolve, reject) => {
            img.onload = resolve;
            img.onerror = () => reject();
          });
          this.sprites[stateKey].push(img);
        } catch (e) {
          // Skip failed sprites
        }
      }

      // Fallback to idle if state loading failed
      if (this.sprites[stateKey].length === 0 && this.sprites.idle.length > 0) {
        this.sprites[stateKey] = [...this.sprites.idle];
      }
    }

    // Ensure idle exists
    if (this.sprites.idle.length === 0) {
      const fallback = new Image();
      fallback.src = `${this.spritePath}/Running/${charName} 1.png`;
      this.sprites.idle = [fallback];
    }
  }

  isKeyPressed(keys, key) {
    return keys[key.toLowerCase()] || keys[key] || false;
  }

  update(keys, opponent, deltaTime) {
    // HAPUS: if (!this.isPlayer) return; (Agar NPC bisa jalan kodenya)

    const wasOnGround = this.isOnGround;
    
    // Physics (Gravity)
    this.velocityY += this.gravity;
    this.y += this.velocityY;

    if (this.y >= this.groundY) {
      this.y = this.groundY;
      this.velocityY = 0;
      this.isOnGround = true;
    } else {
      this.isOnGround = false;
    }

    // Handle attack duration
    if (this.attackDuration > 0) {
      this.attackDuration -= deltaTime;
      this.isAttacking = true;
      this.currentState = this.states.attacking;
    } else {
      this.isAttacking = false;
    }

    // Reset blocking state
    this.isBlocking = false;

    // Gerakan & Aksi
    let moving = false;
    let moveLeft = false;
    let moveRight = false;
    let wantToJump = false;
    let wantToAttack = false;
    let wantToBlock = false;

    if (this.isPlayer) {
      // --- LOGIKA PLAYER (KEYBOARD) ---
      moveLeft = this.isKeyPressed(keys, this.controls.left);
      moveRight = this.isKeyPressed(keys, this.controls.right);
      wantToJump = this.isKeyPressed(keys, this.controls.jump);
      wantToAttack = this.isKeyPressed(keys, this.controls.kick);
      wantToBlock = this.isKeyPressed(keys, this.controls.block);
    } else if (opponent) {
      // --- LOGIKA NPC (AI) ---
      const distanceToOpponent = Math.abs(this.x - opponent.x);
      
      // 1. Kejar pemain jika jauh
      if (distanceToOpponent > 100) {
        if (this.x > opponent.x) moveLeft = true;
        else moveRight = true;
      } 
      
      // 2. Serang jika dekat dan cooldown habis
      if (distanceToOpponent <= 120 && this.attackCooldown <= 0) {
        wantToAttack = true;
      }

      // 3. AI Melompat sesekali jika pemain menyerang (Opsional)
      if (opponent.isAttacking && Math.random() < 0.05 && this.isOnGround) {
        wantToJump = true;
      }
    }

    // Eksekusi Gerakan Horizontal
    if (moveLeft) {
      this.velocityX = -this.speed;
      this.facingRight = false;
      moving = true;
    } else if (moveRight) {
      this.velocityX = this.speed;
      this.facingRight = true;
      moving = true;
    } else {
      this.velocityX = 0;
    }

    // Eksekusi Melompat
    if (wantToJump && this.isOnGround && wasOnGround) {
      this.velocityY = this.jumpPower;
      this.isOnGround = false;
    }

    // State management
    const previousState = this.currentState;

    if (this.attackDuration > 0) {
      // Sedang dalam durasi animasi serang
    } else if (wantToBlock || (this.isPlayer && this.isKeyPressed(keys, this.controls.block))) {
      this.isBlocking = true;
      this.currentState = this.states.blocking;
    } else if (wantToAttack && this.attackCooldown <= 0) {
      this.isAttacking = true;
      this.currentState = this.states.attacking;
      this.attackCooldown = 800; // NPC beri jeda sedikit agar tidak spam
      this.attackDuration = 300;
      this.checkAttack(opponent);
    } else if (!this.isOnGround) {
      this.currentState = this.states.jumping;
    } else if (moving) {
      this.currentState = this.states.running;
    } else {
      this.currentState = this.states.idle;
    }

    // Reset animation on state change
    if (previousState !== this.currentState) {
      this.animationFrame = 0;
      this.animationTimer = 0;
      if (this.currentState === this.states.jumping) {
        this.jumpPrepShown = false;
      }
    }

    // Update position
    this.x += this.velocityX;
    this.x = Math.max(this.width / 2, Math.min(1200 - this.width / 2, this.x));

    // Update cooldowns
    if (this.attackCooldown > 0) {
      this.attackCooldown -= deltaTime;
    }

    if (this.invulnerableTime > 0) {
      this.invulnerableTime -= deltaTime;
    } else {
      this.invulnerable = false;
    }

    // Animation update (Kode animasi kamu tetap sama di bawah sini...)
    this.animationTimer += deltaTime;
    const currentSprites = this.sprites[this.currentState] || this.sprites.idle;
    
    if (this.currentState === this.states.jumping && currentSprites.length >= 3) {
      if (!this.jumpPrepShown) {
        if (this.animationTimer >= 100) {
          this.jumpPrepShown = true;
          this.animationTimer = 0;
        }
        this.animationFrame = 0;
      } else {
        this.animationFrame = 1;
      }
    } else if (currentSprites.length >= 3) {
      if (this.animationTimer >= this.animationSpeed * 1000) {
        this.animationTimer = 0;
        this.animationFrame = (this.animationFrame + 1) % 2;
      }
    }

    if (this.isAttacking && this.attackDuration > 0) {
      this.checkAttack(opponent);
    }
  }

  checkAttack(opponent) {
    if (!opponent || opponent.invulnerable) return;

    const facingOpponent = (this.facingRight && this.x < opponent.x) || 
                          (!this.facingRight && this.x > opponent.x);
    if (!facingOpponent || opponent.isBlocking) return;

    // Bounding box collision
    const thisLeft = this.x - this.width / 2;
    const thisRight = this.x + this.width / 2;
    const thisTop = this.y - this.height;
    const thisBottom = this.y;

    const opponentLeft = opponent.x - opponent.width / 2;
    const opponentRight = opponent.x + opponent.width / 2;
    const opponentTop = opponent.y - opponent.height;
    const opponentBottom = opponent.y;

    // Extend attack range when attacking
    let attackLeft = thisLeft;
    let attackRight = thisRight;
    if (this.isAttacking) {
      if (this.facingRight) {
        attackRight = thisRight + 20;
      } else {
        attackLeft = thisLeft - 20;
      }
    }

    const horizontalOverlap = attackLeft <= opponentRight && attackRight >= opponentLeft;
    const verticalOverlap = thisTop <= opponentBottom && thisBottom >= opponentTop;

    if (horizontalOverlap && verticalOverlap) {
      opponent.takeDamage(this.attackDamage);
    }
  }

  takeDamage(damage) {
    if (this.invulnerable || this.isBlocking) return;

    this.health = Math.max(0, this.health - damage);
    this.invulnerable = true;
    this.invulnerableTime = 500;

    const knockback = 20;
    this.velocityX = this.facingRight ? -knockback : knockback;
  }

  draw(ctx) {
    const currentSprites = this.sprites[this.currentState] || this.sprites.idle;
    if (currentSprites.length === 0) return;
    
    let spriteIndex = 0;
    if (currentSprites.length >= 3) {
      spriteIndex = this.animationFrame + 1; // Use frames 2 and 3 (index 1 and 2)
    }
    const sprite = currentSprites[spriteIndex] || currentSprites[0];
    if (!sprite.complete) return;
    
    ctx.save();

    if (!this.facingRight) {
      ctx.translate(this.x + this.width / 2, 0);
      ctx.scale(-1, 1);
      ctx.translate(-(this.x + this.width / 2), 0);
    }

    if (this.invulnerable && Math.floor(this.invulnerableTime / 50) % 2 === 0) {
      ctx.globalAlpha = 0.5;
    }

    ctx.drawImage(
      sprite,
      this.x - this.width / 2,
      this.y - this.height,
      this.width,
      this.height
    );

    // Debug: show attack hitbox
    if (this.isAttacking) {
      ctx.strokeStyle = '#ff0000';
      ctx.lineWidth = 2;
      let attackLeft = this.x - this.width / 2;
      let attackRight = this.x + this.width / 2;
      if (this.facingRight) {
        attackRight = this.x + this.width / 2 + 20;
      } else {
        attackLeft = this.x - this.width / 2 - 20;
      }
      ctx.strokeRect(
        attackLeft,
        this.y - this.height,
        attackRight - attackLeft,
        this.height
      );
    }

    ctx.restore();
  }
}

export default Character;
