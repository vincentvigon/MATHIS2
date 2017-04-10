clear
clf



// alpha est le paramètre de stabilité dans (0,2]
// beta (avec 2 t) est le paramètre de dysimétrie dans [-1,+1]
function X=simuStable(alpha,betta,sigma,mu,nbSimu)

    V= grand(1,nbSimu,"def")*%pi-%pi/2//angle aléatoire
    W= -log(grand(1,nbSimu,"def")) //v.a. de loi exponentielle(1)

    if (alpha~=1) then

        //quelques constantes
        ta=tan(%pi*alpha/2)
        B=atan (betta*ta)/alpha
        S=(1+betta^2*ta^2)^(1/2/alpha)

        //  simulations 

        X=S*sin(alpha*(V+B))./((cos(V)).^(1/alpha)).*(cos(V-alpha*(V+B))./W).^((1-alpha)/alpha)

        X=sigma.*X+mu

        //alpha=1 est un paramètres très particulier, y compris pour le paramètre d'echelle     
    elseif (alpha==1) then


        X=2/%pi*( (%pi/2+betta.*V).*tan(V) - betta*log(W.*cos(V)/(%pi/2+betta.*V)) )

        X=sigma.*X + 2/%pi*betta*sigma*log(sigma)+mu

    end



endfunction



// test 1 : simple histogram

//alpha=1.2 
//betta= 0 
//sigma=1
//mu=0
//nbSimu=1000
//x=simuStable(alpha,betta,sigma,mu,nbSimu)    
//classes=linspace(-10,10,50)
//histplot(classes,x)



// test 2 : test stability :  
// on compare l'histogramme de la somme de 2 v.a. stables
// avec l'histogramme d'une seule v.a. stable
// en ajustant les paramètres of course
// on trouve la même chose, youpi

nbSimu=50000
alpha=0.1
sigma1=1
sigma2=1
betta1=-1
betta2=0
sigma1=1
sigma2=1
mu1=0
mu2=0

betta=(betta1*sigma1^alpha+betta2*sigma2^alpha)/(sigma1^alpha+sigma2^alpha)
sigma=(sigma1^alpha+sigma2^alpha)^(1/alpha)
mu=mu1+mu2

x1=simuStable(alpha,betta1,sigma1,mu1,nbSimu)   
x2=simuStable(alpha,betta2,sigma2,mu2,nbSimu) 
x=simuStable(alpha,betta,sigma,mu,nbSimu)

classes=linspace(-10,10,50)


disp("alpha,betta,sigma,mu")
disp([alpha,betta,sigma,mu])

subplot(2,1,1)
histplot(classes,x1+x2)
subplot(2,1,2)
histplot(classes,x)

// conclusion, cela marche bien dans quasi tous les cas testé
// exception notable : alpha=1, beta1=1, beta2=-1 ... je ne sais pas pourquoi

// on pourrait s'amuser à faire un test avec la subordination




