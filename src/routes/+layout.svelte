<script lang="ts" context="module">
	// 在模块上下文中添加主题切换逻辑
	if (typeof window !== 'undefined') {
		// 检查用户系统偏好
		const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

		// 检查本地存储的主题设置
		const savedTheme = localStorage.getItem('theme');
		const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');

		// 应用初始主题
		document.documentElement.setAttribute('data-theme', initialTheme);

		// 设置主题切换监听器
		document.getElementById('theme-toggle')?.addEventListener('change', (e) => {
			const isChecked = (e.target as HTMLInputElement).checked;
			const newTheme = isChecked ? 'dark' : 'light';

			document.documentElement.setAttribute('data-theme', newTheme);
			localStorage.setItem('theme', newTheme);
		});

		// 根据当前主题设置切换状态
		const switchElement = document.getElementById('theme-toggle') as HTMLInputElement;
		if (switchElement) {
			switchElement.checked = initialTheme === 'dark';
		}
	}
</script>

<script lang="ts">
	import { base } from '$app/paths';
	import { fly } from 'svelte/transition';

	export let children: any;

	// 当前活动链接状态
	let activeLink = base ? base + '/' : '/';

	// 导航项配置
	const navItems = [
		{ name: '首页', path: base ? base + '/' : '/' },
		{ name: '关于', path: base ? base + '/about' : '/about' },
		{ name: '压缩器', path: base ? base + '/compressor' : '/compressor' }
	];

	// 移动端菜单状态
	let mobileMenuOpen = false;
</script>

<nav class="navbar">
	<!-- 导航栏左侧logo/品牌 -->
	<div class="navbar-brand">
		<a href="{base}/" class="logo-link">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="24"
				height="24"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="1.5"
				stroke-linecap="round"
			>
				<path d="M3 7H21V17H3z" stroke-dasharray="2 2" />
				<!-- 细微纹理 -->
				<path d="M7 21V17H17V21" />
				<path d="M8 10H16M8 13H13" stroke-dasharray="4 2" />
				<!-- 虚线笔触 -->
			</svg>
			<span>绘色</span>
		</a>

		<!-- 移动端菜单切换按钮 -->
		<button class="mobile-toggle" on:click={() => (mobileMenuOpen = !mobileMenuOpen)}>
			{#if mobileMenuOpen}
				<svg
					width="24"
					height="24"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
				>
					<line x1="18" y1="6" x2="6" y2="18" />
					<line x1="6" y1="6" x2="18" y2="18" />
				</svg>
			{:else}
				<svg
					width="24"
					height="24"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
				>
					<line x1="3" y1="12" x2="21" y2="12" />
					<line x1="3" y1="6" x2="21" y2="6" />
					<line x1="3" y1="18" x2="21" y2="18" />
				</svg>
			{/if}
		</button>
	</div>

	<!-- 导航链接区域 -->
	<div class={`nav-links ${mobileMenuOpen ? 'mobile-open' : ''}`}>
		{#each navItems as item}
			<a
				href={item.path}
				class:active={activeLink === item.path}
				on:click={() => {
					activeLink = item.path;
					mobileMenuOpen = false;
				}}
				in:fly={{ y: 20, duration: 300 }}
				out:fly={{ y: -20, duration: 300 }}
			>
				{item.name}
				<span class="link-indicator" />
			</a>
		{/each}
	</div>

	<!-- 主题切换按钮 -->
	<div class="theme-switch"></div>
</nav>

<main class="content-container">
	{@render children()}
</main>

<style lang="scss">
	:global(body) {
		margin: 0;
		padding: 0;
		font-family:
			'Inter',
			system-ui,
			-apple-system,
			sans-serif;
		color: var(--text-primary);
		background: var(--bg-primary);
		transition:
			background-color 0.3s ease,
			color 0.3s ease;
	}

	:root {
		--primary: #6366f1;
		--primary-dark: #4f46e5;
		--text-primary: #0f172a;
		--text-secondary: #475569;
		--bg-primary: #ffffff;
		--bg-secondary: #f1f5f9;
		--border: #e2e8f0;
		--shadow: rgba(0, 0, 0, 0.1);
	}

	[data-theme='dark'] {
		--primary: #818cf8;
		--primary-dark: #6366f1;
		--text-primary: #f1f5f9;
		--text-secondary: #cbd5e1;
		--bg-primary: #0f172a;
		--bg-secondary: #1e293b;
		--border: #334155;
		--shadow: rgba(0, 0, 0, 0.3);
	}

	.navbar {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 1rem 2rem;
		background-color: var(--bg-secondary);
		box-shadow: 0 2px 10px var(--shadow);
		position: sticky;
		top: 0;
		z-index: 100;

		.navbar-brand {
			display: flex;
			align-items: center;
			gap: 1rem;

			.logo-link {
				display: flex;
				align-items: center;
				gap: 0.75rem;
				text-decoration: none;
				font-weight: 700;
				font-size: 1.25rem;
				color: var(--text-primary);
				transition: color 0.2s ease;

				&:hover {
					color: var(--primary);
				}
			}
		}

		.mobile-toggle {
			display: none;
			background: none;
			border: none;
			cursor: pointer;
			color: var(--text-primary);
			padding: 0.5rem;
		}

		.nav-links {
			display: flex;
			gap: 2rem;
			align-items: center;

			a {
				position: relative;
				text-decoration: none;
				color: var(--text-secondary);
				font-weight: 500;
				padding: 0.5rem 0;
				transition: all 0.2s ease;

				&:hover {
					color: var(--text-primary);

					.link-indicator {
						width: 100%;
					}
				}

				&.active {
					color: var(--primary);
					font-weight: 600;

					.link-indicator {
						width: 100%;
						background: var(--primary);
					}
				}

				.link-indicator {
					position: absolute;
					bottom: 0;
					left: 0;
					height: 2px;
					width: 0;
					background: var(--primary);
					border-radius: 2px;
					transition: width 0.3s ease;
				}
			}
		}

		.theme-switch {
			margin-left: 1.5rem;

			.switch {
				position: relative;
				display: inline-block;
				width: 50px;
				height: 26px;

				input {
					opacity: 0;
					width: 0;
					height: 0;

					&:checked + .slider {
						background-color: var(--primary);
					}

					&:checked + .slider:before {
						transform: translateX(24px);
					}
				}

				.slider {
					position: absolute;
					cursor: pointer;
					top: 0;
					left: 0;
					right: 0;
					bottom: 0;
					background-color: var(--border);
					transition: all 0.4s ease;

					&:before {
						position: absolute;
						content: '';
						height: 18px;
						width: 18px;
						left: 4px;
						bottom: 4px;
						background-color: var(--bg-primary);
						transition: all 0.4s ease;
					}

					&.round {
						border-radius: 34px;

						&:before {
							border-radius: 50%;
						}
					}
				}
			}
		}
	}

	.content-container {
		max-width: 1200px;
		margin: 2rem auto;
		padding: 0 2rem;
	}

	/* 响应式设计 */
	@media (max-width: 768px) {
		.navbar {
			padding: 1rem;
			flex-wrap: wrap;

			.mobile-toggle {
				display: block;
			}

			.nav-links {
				flex-direction: column;
				position: absolute;
				top: 100%;
				left: 0;
				right: 0;
				background: var(--bg-secondary);
				box-shadow: 0 5px 10px var(--shadow);
				padding: 1rem;
				gap: 1rem;
				clip-path: polygon(0 0, 100% 0, 100% 0, 0 0);
				transition: clip-path 0.4s ease;

				a {
					width: 100%;
					padding: 0.75rem 1rem;
					border-radius: 0.5rem;

					&:hover,
					&.active {
						background: rgba(var(--primary), 0.1);
					}
				}

				&.mobile-open {
					clip-path: polygon(0 0, 100% 0, 100% 100%, 0% 100%);
				}
			}
		}
	}

	@media (min-width: 769px) {
		.navbar {
			.nav-links {
				margin-left: 2rem;
			}
		}
	}
</style>
