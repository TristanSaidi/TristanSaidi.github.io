---
layout: post
title: Wasserstein Parallel Transport for Distributional Dynamics
date: 2026-10-02 20:54:00-0400
description: Many statistical systems are more naturally represented by probability distributions than vectors. This post describes a geometric way to transfer dynamics between distributions using optimal transport and parallel transport on Wasserstein space.
tags:
categories:
related_posts: false
---

Before we start, I want to mention that this blog is a pedagogical overview of our paper [Wasserstein Parallel Transport for Predicting the Dynamics of Statistical Systems](https://arxiv.org/abs/2603.23736), joint with Gonzalo Mena, Larry Wasserman and Florian Gunsilius. My goal here is not to reproduce all of the technical details of the paper, but rather to explain the geometric idea behind it. If you want some background on manifolds, tangent spaces and Riemannian geometry, I wrote a separate [Introduction to Differential Geometry](/blog/2025/differential-geometry/) that develops some of these ideas from a more classical perspective.

The basic problem is simple to state. Suppose we observe how one probability distribution changes over time. How should we transfer that *dynamics* to a second distribution which starts somewhere else?

For vectors, this is easy: compute the change in the first system and add the same change to the second. For probability distributions, there is no equally obvious notion of adding a ``change'' to a new baseline. The main idea of Wasserstein Parallel Transport is to replace this vector arithmetic with Riemannian geometry.

# Section 1: Parallel trends without a vector space

To motivate the problem, suppose first that we have two scalar-valued systems. Let $z_t$ denote a reference trajectory and let $y_t^*$ denote a counterfactual trajectory that we would like to construct. A classical parallel trends assumption says that the two systems have the same temporal derivative,

$$
\frac{d}{dt}y_t^* = \frac{d}{dt}z_t.
$$

In discrete time, the same idea is

$$
y_{t+1}^* - y_t^* = z_{t+1} - z_t.
$$

Once $y_t^*$ is known, this gives an immediate recursion,

$$
y_{t+1}^* = y_t^* + \left(z_{t+1} - z_t\right).
$$

There are really three operations hiding in this expression:

1. compute the change $z_{t+1}-z_t$;
2. move that change from the reference system to the target system;
3. add the change to the current target value $y_t^*$.

All three operations are automatic in Euclidean space because every tangent space can be identified with the same vector space.

Now suppose our systems are probability distributions. Write $(\nu_t)_{t\geq 0}$ for the reference trajectory and $(\mu_t^*)_{t\geq 0}$ for the counterfactual trajectory that we want to reconstruct. We would like to write something analogous to

$$
\mu_{t+1}^* = \mu_t^* + \left(\nu_{t+1}-\nu_t\right),
$$

but this expression is not geometrically meaningful. Of course, one *can* subtract two probability measures as signed measures, but the result is not a probability measure and the subtraction does not describe how mass moves from one distribution to another.

This is the central issue: the space of probability distributions is not naturally a vector space for the problem we care about.

The geometric replacement will be

$$
\boxed{
\mu_{t+1}^*
=
\operatorname{Exp}_{\mu_t^*}
\left(
\operatorname{PT}_{\nu_t\rightarrow\mu_t^*}
\left[
\operatorname{Log}_{\nu_t}(\nu_{t+1})
\right]
\right).
}
$$

This formula is the entire story in one line. The logarithmic map extracts the dynamics of the reference system, parallel transport moves those dynamics to the target distribution, and the exponential map advances the target system forward. The rest of this post develops the geometry needed to make this expression precise.

# Section 2: Optimal transport as a metric geometry

We will work on the space

$$
\mathcal{P}_2(\mathbb{R}^d)
=
\left\{
\mu \text{ probability measure on }\mathbb{R}^d:
\int \|x\|_2^2\,d\mu(x)<\infty
\right\}.
$$

The first ingredient is a notion of distance between probability measures. Optimal transport builds this distance by asking how cheaply one distribution can be rearranged into another.

**Definition.** A measurable map $T:\mathbb{R}^d\rightarrow\mathbb{R}^d$ pushes $\mu$ forward to $\nu$, written $T_\#\mu=\nu$, if

$$
\nu(B)=\mu(T^{-1}(B))
$$

for every Borel set $B$. Intuitively, if $X\sim\mu$, then $T(X)\sim\nu$.

If moving a point $x$ to $T(x)$ costs $\|x-T(x)\|_2^2$, the Monge optimal transport problem is

$$
\inf_{T:T_\#\mu=\nu}
\int \|x-T(x)\|_2^2\,d\mu(x).
$$

A map cannot split mass, so it is often more convenient to relax the problem to a *coupling*. A coupling $\gamma$ is a joint probability distribution on $(X,Y)$ whose marginals are $\mu$ and $\nu$. This gives the $2$-Wasserstein distance,

$$
W_2^2(\mu,\nu)
=
\inf_{\gamma\in\Gamma(\mu,\nu)}
\int \|x-y\|_2^2\,d\gamma(x,y),
$$

where $\Gamma(\mu,\nu)$ denotes the set of all couplings between $\mu$ and $\nu$. This is a genuine metric on $\mathcal{P}_2(\mathbb{R}^d)$.

A particularly important result tells us that, under mild regularity, the optimal coupling is once again induced by a map.

**Theorem (Brenier).** Suppose $\mu$ has a density with respect to Lebesgue measure. Then the optimal coupling between $\mu$ and $\nu$ is induced by a map

$$
T_{\mu\rightarrow\nu}=\nabla\psi
$$

for some convex function $\psi:\mathbb{R}^d\rightarrow\mathbb{R}$.

This optimal map is called the Brenier map. It will play two roles for us: it tells us how to move from one probability measure to another, and infinitesimal versions of these maps will generate the tangent vectors of Wasserstein space.

## The dynamic formulation

There is another way to view optimal transport which makes the connection to geometry much clearer. Suppose particles evolve according to a time-dependent vector field $v_t$,

$$
\dot X_t = v_t(X_t),
\qquad X_0\sim\mu_0,
$$

and let $\mu_t=\operatorname{Law}(X_t)$. Conservation of probability implies that $(\mu_t,v_t)$ satisfies the continuity equation

$$
\partial_t\mu_t + \nabla\cdot(\mu_t v_t)=0.
$$

The Benamou--Brenier theorem says that the Wasserstein distance can be recovered by minimizing the kinetic energy of all such flows connecting $\mu_0$ to $\mu_1$,

$$
W_2^2(\mu_0,\mu_1)
=
\inf_{(\mu_t,v_t)}
\int_0^1\int \|v_t(x)\|_2^2\,d\mu_t(x)\,dt,
$$

where the infimum is taken over solutions of the continuity equation satisfying the desired endpoints.

This gives a very useful interpretation: Wasserstein distance is the minimum amount of kinetic energy required to deform one distribution into another.

When $T=T_{\mu_0\rightarrow\mu_1}$ is the Brenier map, the minimizing path is

$$
\mu_t = \big((1-t)\operatorname{Id}+tT\big)_\#\mu_0,
\qquad t\in[0,1].
$$

This path is the Wasserstein geodesic between $\mu_0$ and $\mu_1$. At this point, we have more than a distance: we have shortest paths and velocity fields. This is exactly what we need to start thinking in Riemannian terms.

# Section 3: The Riemannian geometry of Wasserstein space

For a usual Riemannian manifold $M$, a tangent vector at $p\in M$ describes an infinitesimal direction in which one can move away from $p$. The same idea works for a probability measure $\mu$. A tangent vector should describe an infinitesimal way to deform $\mu$.

The dynamic formulation above tells us what these infinitesimal deformations look like.

**Definition.** The Wasserstein tangent space at $\mu$ is

$$
T_\mu\mathcal{P}_2(\mathbb{R}^d)
=
\overline{
\left\{\nabla\phi:\phi\in C_c^\infty(\mathbb{R}^d)\right\}
}^{L^2(\mu)}.
$$

So tangent vectors are, up to $L^2(\mu)$ closure, gradient vector fields. The Riemannian metric is simply the $L^2(\mu)$ inner product,

$$
g_\mu(v,w)
=
\int \langle v(x),w(x)\rangle\,d\mu(x).
$$

This is sometimes called Otto's formal Riemannian calculus on Wasserstein space. There are technical qualifications to the word ``manifold'' here---$\mathcal{P}_2(\mathbb{R}^d)$ is not a smooth Hilbert manifold in complete generality---but the tangent-space and covariant-derivative constructions can be made rigorous in the regular settings we use.

In Euclidean Wasserstein space, the logarithmic map has an especially intuitive form. If $T_{\mu\rightarrow\nu}$ is the Brenier map, then

$$
\operatorname{Log}_\mu(\nu)
=
T_{\mu\rightarrow\nu}-\operatorname{Id}.
$$

Indeed, the geodesic from $\mu$ to $\nu$ can be written as

$$
\mu_t
=
\big(\operatorname{Id}+t\operatorname{Log}_\mu(\nu)\big)_\#\mu.
$$

Conversely, for a tangent vector $v$ that generates a Wasserstein geodesic, the exponential map is

$$
\operatorname{Exp}_\mu(v)
=
(\operatorname{Id}+v)_\#\mu.
$$

These are exactly the nonlinear analogues of subtraction and addition that we were missing in Section 1.

## Why we need a connection

There is still one problem. Suppose $v\in T_\nu\mathcal{P}_2(\mathbb{R}^d)$. We want to use this velocity at another distribution $\mu$, but

$$
v\in T_\nu\mathcal{P}_2(\mathbb{R}^d)
\qquad\text{and}\qquad
T_\mu\mathcal{P}_2(\mathbb{R}^d)
$$

are different tangent spaces. On a curved space there is no canonical reason that a vector based at one point should also be a vector based at another.

This is the role of a *connection*. A connection tells us how to differentiate vector fields while accounting for the geometry of the underlying space. The distinguished connection on a Riemannian manifold is the Levi--Civita connection: it is metric-compatible and torsion-free.

For Wasserstein space, suppose $(\mu_t)$ is a curve with tangent velocity $\nabla\phi_t$, and let $v_t$ be another vector field along the curve. The Wasserstein covariant derivative takes the form

$$
\nabla^{W_2}_{\nabla\phi_t}v_t
=
\Pi_{\mu_t}
\left(
\partial_t v_t
+
D v_t\,\nabla\phi_t
\right),
$$

where $Dv_t$ is the Jacobian of the spatial vector field and

$$
\Pi_\mu:L^2(\mu;\mathbb{R}^d)
\longrightarrow
T_\mu\mathcal{P}_2(\mathbb{R}^d)
$$

is the $L^2(\mu)$ orthogonal projection onto the Wasserstein tangent space.

The quantity

$$
\partial_t v_t + Dv_t\,\nabla\phi_t
$$

is the usual material derivative: it differentiates the vector field while moving with the flow of $\mu_t$. The projection is necessary because the material derivative need not itself be a gradient field.

For me, this projection is one of the cleanest ways to understand the Wasserstein geometry. The ambient space contains all square-integrable vector fields, while the tangent space remembers only the gradient component that actually changes the probability distribution. The remaining component is invisible to the continuity equation.

# Section 4: Parallel transport

Now we can finally define what it means for a vector field to remain parallel while its base point moves.

**Definition.** A tangent field $v_t\in T_{\mu_t}\mathcal{P}_2(\mathbb{R}^d)$ is parallel along $(\mu_t)$ if

$$
\nabla^{W_2}_{\dot\mu_t}v_t=0.
$$

If $v_0\in T_{\mu_0}\mathcal{P}_2(\mathbb{R}^d)$ and $v_t$ is the parallel field along a path from $\mu_0$ to $\mu_1$, we denote its endpoint by

$$
\operatorname{PT}_{\mu_0\rightarrow\mu_1}(v_0).
$$

Parallel transport is the correct geometric notion of moving a vector from one tangent space to another without introducing artificial rotation or distortion from our choice of coordinates.

Using the projection formula above, parallelity can equivalently be characterized, under suitable regularity, by

$$
\nabla\cdot\left[
\mu_t
\left(
\partial_t v_t + Dv_t\,\nabla\phi_t
\right)
\right]
=0.
$$

This characterization is mathematically clean, but computationally unpleasant: exact parallel transport is described by a high-dimensional PDE. Solving this PDE every time we want to transfer a trend would make the method difficult to use.

The main computational question is therefore: can we approximate Wasserstein parallel transport using only standard optimal transport operations?

# Section 5: Approximating Wasserstein parallel transport

Suppose $\nu$ and $\mu$ are two nearby probability measures, and let

$$
T=T_{\nu\rightarrow\mu}
$$

be the Brenier map between them. Suppose also that $v\in T_\nu\mathcal{P}_2(\mathbb{R}^d)$ is the tangent vector that we want to transport.

The approximation has a simple geometric interpretation.

First, use the optimal transport map to match a point $x$ under $\nu$ with the point $T(x)$ under $\mu$. Because the ambient space is $\mathbb{R}^d$, ordinary Euclidean parallel transport does nothing to the vector itself. Thus, at matched points, define

$$
\widetilde v(T(x))=v(x).
$$

If $T$ is invertible almost everywhere, this can be written as

$$
\widetilde v = v\circ T^{-1}.
$$

There is no guarantee that $\widetilde v$ belongs to $T_\mu\mathcal{P}_2(\mathbb{R}^d)$, since it need not be a gradient field. So the second step is simply to project it back onto the tangent space,

$$
\widehat{\operatorname{PT}}_{\nu\rightarrow\mu}(v)
=
\Pi_\mu(\widetilde v).
$$

Put simply, the local approximation is

$$
\boxed{
\text{match points by optimal transport}
\quad+\quad
\text{carry the vectors along those matches}
\quad+\quad
\text{project back onto the tangent space}.
}
$$

Under regularity conditions, this is a second-order local approximation to exact parallel transport:

$$
\left\|
\widehat{\operatorname{PT}}_{\nu\rightarrow\mu}(v)
-
\operatorname{PT}_{\nu\rightarrow\mu}(v)
\right\|_{L^2(\mu)}
\lesssim
W_2^2(\nu,\mu).
$$

This immediately suggests how to transport over a long distance. Let $(\lambda_s)_{s\in[0,1]}$ be the Wasserstein geodesic from $\nu$ to $\mu$, divide it into $N$ small pieces,

$$
\lambda_0,\lambda_{1/N},\ldots,\lambda_1,
$$

and repeatedly apply the local transport step. A local error of order $N^{-2}$ accumulated across $N$ steps gives a global error of order $N^{-1}$, and the paper makes this argument precise under appropriate assumptions.

In the general manifold setting, the paper packages this idea into a *fanning scheme*: base-manifold parallel transport can itself be approximated using Jacobi fields. For $M=\mathbb{R}^d$, that base-space parallel transport is just the identity, leaving the Brenier matching + tangent-space projection picture above. The important point for this post is that we can approximate Wasserstein parallel transport through tractable geometric primitives rather than directly solving the parallel-transport PDE.

# Section 6: Wasserstein Parallel Trends

We can now return to the original problem. Suppose we observe a reference trajectory

$$
\nu_0,\nu_1,\ldots,\nu_T
$$

and know the initial target distribution $\mu_0^*$. We want to reconstruct the target trajectory that would exhibit the *same intrinsic dynamics* as the reference trajectory while starting from a different baseline.

The reference change from time $i$ to $i+1$ is the Wasserstein logarithm

$$
v_i
=
\operatorname{Log}_{\nu_i}(\nu_{i+1})
=
T_{\nu_i\rightarrow\nu_{i+1}}-\operatorname{Id}.
$$

This is a tangent vector at $\nu_i$. We then transport this vector to the current target distribution $\mu_i^*$,

$$
v_i^*
=
\operatorname{PT}_{\nu_i\rightarrow\mu_i^*}(v_i),
$$

and use the exponential map to advance the target trajectory,

$$
\mu_{i+1}^*
=
\operatorname{Exp}_{\mu_i^*}(v_i^*).
$$

This leads to our distributional analogue of parallel trends.

**Definition (Wasserstein Parallel Trends).** We say the reference trajectory $(\nu_i)$ and the counterfactual trajectory $(\mu_i^*)$ satisfy Wasserstein Parallel Trends if

$$
\operatorname{Log}_{\mu_i^*}(\mu_{i+1}^*)
=
\operatorname{PT}_{\nu_i\rightarrow\mu_i^*}
\left[
\operatorname{Log}_{\nu_i}(\nu_{i+1})
\right]
$$

at each time step.

Compare this directly with the Euclidean parallel-trends equation

$$
y_{i+1}^*-y_i^*=z_{i+1}-z_i.
$$

The dictionary is

$$
\begin{aligned}
\text{subtraction} &\longrightarrow \operatorname{Log},\\
\text{identifying tangent spaces} &\longrightarrow \operatorname{PT},\\
\text{addition} &\longrightarrow \operatorname{Exp}.
\end{aligned}
$$

This is the conceptual core of the method. We are not trying to manufacture a vector-space structure on probability distributions. Instead, we use the geometry that Wasserstein space already has.

In practice we replace exact parallel transport with the approximation from the previous section,

$$
\widehat v_i^*
=
\widehat{\operatorname{PT}}_{\nu_i\rightarrow\widehat\mu_i^*}(v_i),
$$

and recursively compute

$$
\widehat\mu_{i+1}^*
=
\operatorname{Exp}_{\widehat\mu_i^*}(\widehat v_i^*).
$$

In $\mathbb{R}^d$, whenever the exponential representation is valid, the last step is simply

$$
\widehat\mu_{i+1}^*
=
\left(\operatorname{Id}+\widehat v_i^*\right)_\#\widehat\mu_i^*.
$$

So the final procedure is remarkably concrete: estimate an optimal transport map, extract a tangent velocity, parallel transport that velocity to the new baseline, and push the target distribution forward.

# Section 7: Recovering classical parallel trends

A natural sanity check is whether this geometric notion agrees with classical parallel trends when we look only at averages. It does.

Suppose $(\nu_t)$ and $(\mu_t^*)$ are sufficiently regular curves with tangent fields $\nabla\phi_t$ and $\nabla\phi_t^*$, and suppose their dynamics are related by Wasserstein parallel transport,

$$
\nabla\phi_t^*
=
\operatorname{PT}_{\nu_t\rightarrow\mu_t^*}[\nabla\phi_t].
$$

Then, under the regularity assumptions in the paper,

$$
\frac{d}{dt}
\int x\,d\nu_t(x)
=
\frac{d}{dt}
\int x\,d\mu_t^*(x).
$$

In other words, Wasserstein Parallel Trends implies ordinary parallel trends of the means.

This property is important because it tells us that the geometric construction is genuinely an extension of the classical idea, rather than an unrelated notion that happens to share the same name. But it is strictly richer: the Wasserstein tangent vector describes how mass moves throughout the entire state space, so it can encode changes in scale, covariance, skewness, multimodality and other distributional features which are invisible to the mean.

# Section 8: Gaussian distributions make the geometry concrete

The Gaussian case gives a particularly transparent example. Suppose

$$
\mu_t=\mathcal{N}(m_t,\Sigma_t).
$$

A tangent field which keeps the trajectory inside the Gaussian family has the affine form

$$
v_t(x)
=
a_t+A_t(x-m_t),
$$

where $A_t$ is symmetric. Plugging this velocity field into the continuity equation gives

$$
\dot m_t=a_t
$$

and

$$
\dot\Sigma_t
=
A_t\Sigma_t+\Sigma_tA_t.
$$

So the two pieces of the tangent vector have immediate interpretations: $a_t$ controls how the mean moves, while $A_t$ controls how the covariance deforms.

This is already enough to see why transporting a *full tangent vector* is richer than transporting a mean trend. Two Gaussian systems can have identical mean dynamics while one expands, contracts or rotates its covariance structure. Wasserstein parallel transport moves this covariance dynamics along with the location dynamics.

In our paper, parallel transport between Gaussian measures can be computed in closed form by reducing the problem to a continuous Lyapunov equation. The figures below give two examples of the same reference tangent $v$ being transported to different Gaussian baselines. The resulting endpoint depends on the geometry of the baseline distribution, not just on the Euclidean vector attached to its mean.

<div class="row mt-3">
    <div class="col-sm mt-3 mt-md-0 text-center">
        {% include figure.liquid loading="eager" path="assets/img/wpt/gaussian_transport_1.png" class="img-fluid rounded z-depth-1" %}
    </div>
    <div class="col-sm mt-3 mt-md-0 text-center">
        {% include figure.liquid loading="eager" path="assets/img/wpt/gaussian_transport_2.png" class="img-fluid rounded z-depth-1" %}
    </div>
</div>
<div class="caption">
    Gaussian examples of Wasserstein parallel transport. The same reference dynamics can induce different deformations after being transported to a new distributional baseline.
</div>

The Gaussian case is special because everything can be written explicitly, but the geometric idea is not restricted to Gaussian measures. In the general setting, the tangent field can encode much more complicated redistributions of mass.

# Section 9: Approximation guarantees

There are two distinct approximation problems worth separating.

The first is geometric: exact Wasserstein parallel transport is defined by the covariant derivative, while our computational method approximates it by many short optimal-transport-and-projection steps. If $N$ denotes the number of interpolation steps used to approximate each parallel transport operation, then under the regularity assumptions in the paper the accumulated counterfactual reconstruction error satisfies a bound of the form

$$
\sum_{i=1}^T
W_2\left(\widehat\mu_i^*,\mu_i^*\right)
=
O\left(\frac{1}{N}\right).
$$

Thus, as the geodesic discretization is refined, the reconstructed dynamics converge to the trajectory generated by exact Wasserstein parallel transport.

The second problem is statistical: in applications, the distributions themselves are usually unknown and replaced by empirical estimates. This introduces a separate source of error from estimating transport maps, tangent fields and projections from finite samples. I am deliberately separating that issue from the geometric approximation here, since the main point of this post is the structure of the method itself.

# Section 10: The big picture

The entire construction can be summarized by comparing one Euclidean equation with one Wasserstein equation.

In a vector space, parallel dynamics are propagated by

$$
y_{t+1}^*
=
y_t^*
+
\left(z_{t+1}-z_t\right).
$$

On Wasserstein space, the corresponding operation is

$$
\boxed{
\mu_{t+1}^*
=
\operatorname{Exp}_{\mu_t^*}
\left(
\operatorname{PT}_{\nu_t\rightarrow\mu_t^*}
\left[
\operatorname{Log}_{\nu_t}(\nu_{t+1})
\right]
\right).
}
$$

The logarithmic map extracts a trend, parallel transport moves that trend between tangent spaces, and the exponential map applies it at the new baseline.

What I like about this formulation is that ``parallel trends'' becomes literally geometric. Rather than defining parallelism through subtraction, we define it by transporting tangent dynamics without distortion along the geometry of the space of probability measures. Optimal transport provides the metric, the metric induces a Riemannian structure, and that structure gives us the notion of parallel transport needed to move dynamics from one distribution to another.

For the technical details, proofs, Gaussian formulas and the full fanning construction, see the [paper](https://arxiv.org/abs/2603.23736).
