export const handler = (_request, _context) => {
  return new Response(`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
        <title>The Silly Specification</title>

        <meta name="viewport" content="width=device-width, initial-scale=1">

        <link href="/styles/system.css" rel="stylesheet">
      </head>
      <body>
				<article class="single-column" style="padding-bottom: 25vh;">
					<nav>
						<a href="/">Go Home</a>
					</nav>
					<header>
						<h1>
							# The Silly Specification
						</h1>
					</header>
					<main id="main" class="full-bleed single-column">
						<h2>
							## Abstract
						</h2>

						<p>
							Nature often repeats. Color, waves of light. Music, waves of sound. Categorically, we can organize both.	
						</p>

						<p>
							Code repeats in a similar way. Waves of patterns. When immersed in code, these patterns can be felt in the mind.
						</p>

						<p>
							A painter trains the eye with color. A musician trains the ear with notes. A coder trains the mind with relationships.
						</p>

						<p>
							Successful coders simply study and practice. However, the world of code is vast and spans generations. Where should one begin to study and where can one practice?
						</p>

						<p>
							The Silly Specification delivers the minimum viable ecosystem for aspiring coders that want real power and not the nerfed alternatives.
						</p>

						<h2>
							## Introduction
						</h2>

						<p>
							Assume a Tree exists that grows fruits, or Nodes, of many kinds. Specifically, you can see apples, oranges, and bananas. You might be able to identify more fruit with a **Module**, let's build one!
						</p>

						<h2>
							## Module
						</h2>

						<p>
							let _Module_ be a Function with two Parameters, Selector and State.
							<br/>
							let Selector be a required String used to match Nodes.
							<br/>
							let State be optional, yet always JSON to serve as a default Structure.
						</p>

						<p>
							Calling _Module_ will Return an Object with Module Selector as a property named "selector" and five Methods.
						</p>

						<h3>
							1. Render
						</h3>

						<p>
							let _Render_ be a Function with one Parameter, Compositor.
							<br/>
							let Compositor be a Function with one Parameter, Target.
							<br/>
							let Target be a Node.
						</p>

						<p>
							Calling _Render_ will subscribe the Compositor to State updates. Any Nodes matching the Selector will be notified immediately.
						</p>

						<div class="full-bleed">
	hi
						</div>

						<h3>
							2. Style
						</h3>

						<p>
							let _Style_ be a Function with one Parameter, Rules.  
							let Rules be a String with one special character.
						</p>

						<p>
							Calling _Style_ will register Rules with the Tree to apply Layout, Paint, and Composite effects.
						</p>

						<h3>
							3. On
						</h3>

						<p>
							let _On_ be a Function with three Parameters, Event Type, Selector, and Macro.
							<br/>
							let Event Type be a String of the Enumerated Event Types on a Node.
							<br/>
							let Selector be a String used to match Children of the Compositor Target.
							<br/>
							let Macro be a Function with one Parameter, Event.
							<br/>
							let Event be an Object with the evented Node as a property named "target".
						</p>

						<p>
							Calling _On_ will register the Macro with the Tree to be notified when Selected Children of the Compositor Target are evented.
						</p>

						<h3>
							4. Read
						</h3>

						<p>
							let _Read_ be a Function
						</p>

						<p>
							Calling _Read_ will Return the current State.
						<p>

						<h3>
							5. Write
						</h3>

						<p>
							let _Write_ be a Function with two Parameters, Patch and Merge Handler
							<br/>
							let Patch be a required JSON to be merged into state as is
							<br/>
							let Merge Handler be an optional Function with two Parameters, State and Patch
							<br/>
							let State be Module State
							<br/>
							let Patch be Patch
						</p>

						<p>
							Calling _Write_ will merge the current Patch into State. A custom Merge Handler may be used to manually apply the Patch by Returning the next full State.
						</p>

						<h2>
							## Conclusion
						</h2>

						<p>
							Hopefully by now you are either a human that speaks computer better or a computer that speaks human better!
						</p>

						<hr/>
						<p>
							"I've always known what types
							<em>
								_are_
							</em>
							, I've just never particularly liked their
							<strong>
								**rigorous enforcement**
							</strong>
							, whether letter graded, peer reviewed, machine learned, or god offended." - Tyler Childs
						</p>
					</main>
					<footer>
						<stay-in-touch></stay-in-touch>
					</footer>
				</article>
        <script type="module" src="/packages/tags/design-system.js"></script>
        <script type="module" src="/packages/tags/stay-in-touch.js"></script>
				<design-system></design-system>
      </body>
    </html>
  `, {
    headers: {
      "Content-Type": 'text/html; charset=utf-8'
    }
  })
}
