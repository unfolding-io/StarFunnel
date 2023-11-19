import { defineCollection, reference, z } from 'astro:content'
import { getIconName } from '@util/helpers'
 

const blocks = z
	.array(
		z.object({
			component: z.string(),
			title: z.string().optional(),
			content: z.string().optional(),

			style: z.object({
				template: z.string().optional(),
				surface: z.string().optional(),
				container: z.string().optional(),
				animate: z.boolean().optional(),
				block_class: z.string().optional(),
				reverse: z.boolean().optional(),
			}).optional(),

			media: z.object({	
				image_size: z.string().optional(),
				image_opacity: z.string().optional(),
				thumbnail: z.string().optional(),
				title: z.string().optional(),
				video_preview: z.string().optional(),
				video_id: z.string().optional(),
				embed: z.string().optional(),
				aspect: z.number().or(z.string()).transform((val) => {
					if (typeof val === 'string') return parseFloat(val)
					if (!!val && val > 0) return val
					return 0
				}).optional(),

			}).optional(),

		

			aspect: z.number().or(z.string()).transform((val) => {
				if (typeof val === 'string') return parseFloat(val)
				if (!!val && val > 0) return val
				return 0
			}).optional(),

			 
			link: z.string().optional(),
			post_tag:  z.array(z.string()).optional(),  

			 
			count: z.number().optional(),
			code: z.string().optional(),
			newsletter: z.string().optional(),

			prices: z.array(z.object({
				title: z.string().optional(),
				intro: z.string().optional(),
				price_suffix: z.string().optional(),
				surface: z.string().optional(),
				price: z.string(),
				buttons: z
				.array(
					z.object({
						href: z.string(),
						className: z.string().optional(),
						label: z.string(),
						color: z.string().optional(),
						icon: z.string().transform((val) => getIconName(val)).optional(),
						icon_only: z.boolean().optional()
					})
				)
				.optional(),
						 	 
				features: z.array(
					z.object({
						label: z.string().optional(),
						value: z.string().optional(),
						icon_class: z.string().optional(),
						icon: z.string().transform((val) => getIconName(val)).optional(),
					 
					})
				).optional(),
				



			})).optional(),	

			items: z.array(z.object({
				title: z.string().optional(),
				description: z.string().optional(),
				id: z.string().optional(),

			})).optional(),	

			timing: z.object({
				delay: z.number().or(z.string()).optional(),
				duration: z.number().or(z.string()).optional(),
				on_load: z.boolean().optional(),
			}).optional(),
			
			
			images: z
				.array(
					z.string()
				)
				.optional(),
			buttons: z
				.array(
					z.object({
						href: z.string(),
						className: z.string().optional(),
						label: z.string(),
						color: z.string().optional(),
						icon: z.string().transform((val) => getIconName(val)).optional(),
						icon_only: z.boolean().optional()
					})
				)
				.optional(),
			features: z
				.array(
					z.object({
						href: z.string().optional(),
						className: z.string().optional(),
						title: z.string().optional(),
						content: z.string().optional(),
						color: z.string().optional(),
						icon: z.string().transform((val) => getIconName(val)).optional(),
					})
				)
				.optional()
		})
	)
	.optional()

const style = z.object({
	template: z.string().optional(),
	nav_color: z.string().optional(),	 
	hero_template: z.string().optional(),
	hero_surface: z.string().optional(),
	hero_image_opacity: z.string().optional(),
	container: z.string().optional(),
	page_class: z.string().optional(),
	content_class: z.string().optional(),
	block_class: z.string().optional()
})

const blog = defineCollection({
	type: 'content',
	schema: z.object({
		title: z.string(),
		description: z.string(),
		intro: z.string().optional(),
		thumbnail: z.string(),
		og_image: z.string().optional(),
		tag: z.array(z.string()).optional(),
		
		pubDate: z
			.string()
			.or(z.date())
			.transform((val) => new Date(val)),

		nav: z
			.object({
				next: z
					.array(
						z.object({
							href: z.string(),
							title: z.string()
						})
					)
					.optional(),

				prev: z
					.array(
						z.object({
							href: z.string(),
							title: z.string()
						})
					)
					.optional()
			})
			.optional(),

		blocks: blocks,
		style: style
	})
})
 

 

 
const page = defineCollection({
	type: 'content',
	schema: z.object({
		title: z.string(),
		description: z.string(),
		intro: z.string().optional(),
		thumbnail: z.string(),
		og_image: z.string().optional(),  
		hero: z.object({
			title: z.string().optional(),
			intro: z.string().optional(),
			media: z.object({
					thumbnail: z.string().optional(),
					background_image: z.string().optional(),
					video_id: z.string().optional(),
					image_opacity: z.string().optional(),
					video_preview: z.string().optional(),
					embed: z.string().optional(),
					aspect: z.number().or(z.string()).optional()
				}).optional(),

			 style: z.object({
					surface: z.string().optional(),
					class: z.string().optional(),
					container: z.string().optional(),
					background: z.string().optional(),
					layout: z.string().optional(),
					pattern: z.string().optional(),
				}).optional(),
			
			 
			buttons: z.array(
				z.object({
					href: z.string(),
					className: z.string().optional(),
					label: z.string(),
					color: z.string().optional(),
					icon: z.string().transform((val) => getIconName(val)).optional(),
					icon_only: z.boolean().optional()
				})
			).optional()

		}).optional(),

		 

		blocks: blocks,
		style: style

		
	})
})

const config = defineCollection({
	type: 'content',
	schema: z.object({
		sitename: z.string().optional(),
		title: z.string().optional(),
		description: z.string().optional(),
		newsletter_text: z.string().optional(),
		footer_text: z.string().optional(),
		per_page: z.number().optional(),
		intro: z.string().optional(),
		thumbnail: z.string().optional(),
		og_image: z.string().optional(),
		
		surface: z.array(z.object({
				name: z.string(),
				class: z.string()
			})).optional(),
		
	 
		form: z.object({
				title: z.string(),
				intro: z.string().optional(),
				thumbnail: z.string(),
				provider: z.string(),
				topics: z.array(z.object({
					label: z.string(),
					email: z.string().optional(),
					slack_id: z.string().optional(),
				})).optional(),
				 
			}).optional(),

		newsletter: z.object({
				title: z.string(),
				intro: z.string().optional(),
				link: z.string().optional(),
				status: z.string().optional(),
				thanks: z.string().optional(),
				thumbnail: z.string(), 
				list: z.array(z.object({
					title: z.string(),
					intro: z.string().optional(),
					thanks: z.string().optional(),
					link: z.string().optional(),
					tags: z.array(z.string()).optional(),
					status: z.string().optional(),	
					id: z.string().optional(),
					include_main_list: z.boolean().optional(),
					thumbnail: z.string(),
				})).optional(),
				 
			}).optional(),
		auth: z.object({ 
				thumbnail: z.string(), 
				 	 
			}).optional(),

		blog_tags: z
			.array(
				z.object({
					title: z.string(),
					name: z.string(),
					description: z.string(),
					thumbnail: z.string(),
					intro: z.string().optional(),
					body: z.string().optional(),		
					overwrite_style:z.boolean().optional(),
					
				})
			)
			.optional(),

		project_tags: z
			.array(
				z.object({
					title: z.string(),
					name: z.string(),
					description: z.string(),
					thumbnail: z.string(),
					intro: z.string().optional(),
					body: z.string().optional(),		
					overwrite_style:z.boolean().optional(),
					
				})
			)
			.optional(),

		

		style: style.optional(),

		main_menu: z
			.array(
				z.object({
					href: z.string(),
					label: z.string()
				})
			)
			.optional(),
		cta_menu: z
			.array(
				z.object({
					href: z.string(),
					label: z.string()
				})
			)
			.optional(),

		footer_menus: z
			.array(
				z.object({
					label: z.string(),
					links: z.array(
					z.object({
						href: z.string(),
						label: z.string()
					})
				)
				})
			)
			.optional(),

		social: z
			.array(
				z.object({
					href: z.string(),
					label: z.string(),
					icon: z.string().transform((val) => getIconName(val)),
				})
			)
			.optional()
	})
})

export const collections = { blog, page,  config }
